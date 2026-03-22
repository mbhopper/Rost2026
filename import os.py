import os
import hashlib
import secrets
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import qrcode
from io import BytesIO
import base64
import sqlite3

load_dotenv()

# ========== ИНИЦИАЛИЗАЦИЯ FLASK ==========
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(32))
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
app.config['SESSION_COOKIE_SECURE'] = False  # Для разработки
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Включаем CORS для API
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ========== БАЗА ДАННЫХ ==========
def get_db():
    """Получение соединения с БД"""
    conn = sqlite3.connect('rostelecom.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Инициализация базы данных"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Таблица пользователей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id TEXT UNIQUE,
            full_name TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            department TEXT,
            position TEXT,
            account_status INTEGER DEFAULT 1,
            access_status INTEGER DEFAULT 1,
            last_login DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица рабочих сессий
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS work_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            session_type TEXT DEFAULT 'notebook',
            device_name TEXT,
            location TEXT,
            network_type TEXT,
            login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
            logout_time DATETIME,
            is_active INTEGER DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Таблица QR-кодов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS qr_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            qr_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            is_used INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Таблица логов входов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS login_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            user_agent TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Создаём тестового пользователя
    cursor.execute("SELECT * FROM users WHERE email = 'alex@futurepass.app'")
    if not cursor.fetchone():
        password_hash = hashlib.sha256('123456'.encode()).hexdigest()
        cursor.execute('''
            INSERT INTO users (employee_id, full_name, first_name, last_name, email, phone, password_hash, department, position, last_login)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('EMP-1042', 'Иванов Алексей Сергеевич', 'Алексей', 'Иванов', 
              'alex@futurepass.app', '+7 (999) 555-01-42', password_hash,
              'Platform Engineering', 'Senior Frontend Engineer', datetime.now().isoformat()))
        
        user_id = cursor.lastrowid
        
        # Создаём активные сессии
        cursor.execute('''
            INSERT INTO work_sessions (user_id, session_type, device_name, location, network_type, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, 'notebook', 'Ноутбук сотрудника', 'Санкт-Петербург', 'корпоративная сеть', 1))
        
        cursor.execute('''
            INSERT INTO work_sessions (user_id, session_type, device_name, location, network_type, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, 'mobile', 'Мобильный браузер', 'Москва', 'демо-подключение', 1))
    
    conn.commit()
    conn.close()
    print("✅ База данных инициализирована")

# Запускаем инициализацию
init_db()

# ========== ДЕКОРАТОРЫ ==========
def login_required(f):
    """Декоратор для проверки авторизации"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            if request.path.startswith('/api/'):
                return jsonify({'error': 'Unauthorized'}), 401
            flash('Пожалуйста, войдите в систему', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def api_login_required(f):
    """Декоратор для API авторизации"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

# ========== МАРШРУТЫ ДЛЯ СТРАНИЦ (ФРОНТЕНД) ==========
@app.route('/')
def index():
    """Главная страница"""
    if 'user_id' in session:
        return redirect(url_for('profile'))
    return redirect(url_for('login'))

@app.route('/login')
def login():
    """Страница входа"""
    if 'user_id' in session:
        return redirect(url_for('profile'))
    return render_template('login.html')

@app.route('/profile')
@login_required
def profile():
    """Страница профиля"""
    return render_template('profile.html')

@app.route('/qr')
@login_required
def qr_page():
    """Страница QR-кода"""
    return render_template('qr.html')

@app.route('/faq')
@login_required
def faq():
    """Страница FAQ"""
    return render_template('faq.html')

# ========== API МАРШРУТЫ (СВЯЗЬ БЭКЭНДА И ФРОНТЕНДА) ==========

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    """
    API для входа
    Фронтенд отправляет POST с email и password
    Бэкэнд проверяет и возвращает токен сессии
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'success': False, 'error': 'Email и пароль обязательны'}), 400
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    conn = get_db()
    user = conn.execute('''
        SELECT id, full_name, first_name, email, department, position, employee_id, account_status
        FROM users 
        WHERE email = ? AND password_hash = ?
    ''', (email, password_hash)).fetchone()
    conn.close()
    
    if user:
        if not user['account_status']:
            return jsonify({'success': False, 'error': 'Аккаунт заблокирован'}), 403
        
        # Создаём сессию
        session.permanent = True
        session['user_id'] = user['id']
        session['user_name'] = user['full_name']
        session['user_first_name'] = user['first_name']
        session['user_email'] = user['email']
        session['employee_id'] = user['employee_id']
        session['department'] = user['department']
        session['position'] = user['position']
        
        # Логируем вход
        conn = get_db()
        conn.execute('''
            UPDATE users SET last_login = ? WHERE id = ?
        ''', (datetime.now().isoformat(), user['id']))
        
        conn.execute('''
            INSERT INTO login_logs (user_id, ip_address, user_agent)
            VALUES (?, ?, ?)
        ''', (user['id'], request.remote_addr, request.headers.get('User-Agent', '')))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'name': user['full_name'],
                'first_name': user['first_name'],
                'email': user['email'],
                'department': user['department'],
                'position': user['position'],
                'employee_id': user['employee_id']
            }
        })
    
    return jsonify({'success': False, 'error': 'Неверный email или пароль'}), 401

@app.route('/api/auth/logout', methods=['POST'])
@api_login_required
def api_logout():
    """API для выхода"""
    session.clear()
    return jsonify({'success': True})

@app.route('/api/auth/me', methods=['GET'])
@api_login_required
def api_me():
    """API для получения текущего пользователя"""
    return jsonify({
        'id': session.get('user_id'),
        'name': session.get('user_name'),
        'first_name': session.get('user_first_name'),
        'email': session.get('user_email'),
        'employee_id': session.get('employee_id'),
        'department': session.get('department'),
        'position': session.get('position')
    })

@app.route('/api/profile', methods=['GET'])
@api_login_required
def api_profile():
    """API для получения полного профиля сотрудника"""
    user_id = session['user_id']
    conn = get_db()
    
    # Данные пользователя
    user = conn.execute('''
        SELECT employee_id, full_name, first_name, last_name, email, phone, 
               department, position, account_status, access_status, last_login
        FROM users WHERE id = ?
    ''', (user_id,)).fetchone()
    
    # Активные сессии
    sessions = conn.execute('''
        SELECT session_type, device_name, location, network_type, login_time, last_activity
        FROM work_sessions WHERE user_id = ? AND is_active = 1
    ''', (user_id,)).fetchall()
    
    # Активные QR-коды
    active_qr = conn.execute('''
        SELECT COUNT(*) as count FROM qr_codes 
        WHERE user_id = ? AND is_used = 0 AND expires_at > ?
    ''', (user_id, datetime.now())).fetchone()
    
    conn.close()
    
    return jsonify({
        'user': {
            'employee_id': user['employee_id'],
            'full_name': user['full_name'],
            'first_name': user['first_name'],
            'email': user['email'],
            'phone': user['phone'],
            'department': user['department'],
            'position': user['position'],
            'account_status': bool(user['account_status']),
            'access_status': bool(user['access_status']),
            'last_login': user['last_login']
        },
        'active_sessions': [dict(s) for s in sessions],
        'active_qr_count': active_qr['count']
    })

@app.route('/api/qr/generate', methods=['POST'])
@api_login_required
def api_generate_qr():
    """API для генерации QR-кода"""
    user_id = session['user_id']
    user_name = session.get('user_name')
    employee_id = session.get('employee_id')
    
    # Генерируем данные для QR
    qr_data = f"ID:{employee_id}|NAME:{user_name}|TIME:{datetime.now().isoformat()}"
    
    # Создаём QR-код
    qr = qrcode.QRCode(version=1, box_size=8, border=4)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="#1a5f7a", back_color="white")
    
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    qr_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    # Сохраняем в БД
    expires_at = datetime.now() + timedelta(minutes=15)
    conn = get_db()
    conn.execute('''
        INSERT INTO qr_codes (user_id, qr_data, expires_at)
        VALUES (?, ?, ?)
    ''', (user_id, qr_data, expires_at))
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'qr_code': qr_base64,
        'expires_at': expires_at.isoformat()
    })

@app.route('/api/qr/refresh', methods=['POST'])
@api_login_required
def api_refresh_qr():
    """API для обновления QR-кода"""
    return api_generate_qr()

@app.route('/api/sessions', methods=['GET'])
@api_login_required
def api_sessions():
    """API для получения активных сессий"""
    user_id = session['user_id']
    conn = get_db()
    
    sessions = conn.execute('''
        SELECT id, session_type, device_name, location, network_type, 
               login_time, last_activity
        FROM work_sessions 
        WHERE user_id = ? AND is_active = 1
    ''', (user_id,)).fetchall()
    
    conn.close()
    
    return jsonify({
        'sessions': [dict(s) for s in sessions],
        'count': len(sessions)
    })

@app.route('/api/sessions/update', methods=['POST'])
@api_login_required
def api_update_session():
    """API для обновления активности сессии"""
    user_id = session['user_id']
    data = request.get_json()
    session_id = data.get('session_id')
    
    conn = get_db()
    conn.execute('''
        UPDATE work_sessions SET last_activity = ? 
        WHERE id = ? AND user_id = ?
    ''', (datetime.now().isoformat(), session_id, user_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/stats', methods=['GET'])
@api_login_required
def api_stats():
    """API для получения статистики"""
    user_id = session['user_id']
    conn = get_db()
    
    # Получаем все сессии пользователя
    sessions = conn.execute('''
        SELECT * FROM work_sessions WHERE user_id = ?
    ''', (user_id,)).fetchall()
    
    # Подсчитываем статистику
    total_sessions = len(sessions)
    active_sessions = sum(1 for s in sessions if s['is_active'])
    
    conn.close()
    
    return jsonify({
        'total_sessions': total_sessions,
        'active_sessions': active_sessions,
        'last_activity': datetime.now().isoformat()
    })

# ========== СТАТИЧЕСКИЕ ФАЙЛЫ ==========
@app.route('/static/<path:path>')
def serve_static(path):
    """Отдача статических файлов"""
    return send_from_directory('static', path)

# ========== ЗАПУСК ==========
if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Запуск сервера Ростелеком Портал")
    print("=" * 50)
    print("📍 Адрес: http://localhost:5000")
    print("🔑 Тестовый доступ:")
    print("   Email: alex@futurepass.app")
    print("   Пароль: 123456")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)

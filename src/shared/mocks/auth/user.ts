import { USER_ROLES, USER_STATUSES } from '../../../entities/user/model';
import type { UserDto } from '../../api/dto';

export const mockUserDto: UserDto = {
  id: 'user-alex-ivanov',
  employee_id: 'EMP-1042',
  first_name: 'Александр',
  last_name: 'Иванов',
  middle_name: 'Сергеевич',
  email: 'alex.ivanov@futurepass.app',
  phone: '+7 (999) 555-01-42',
  department: 'Отдел цифровых платформ',
  position: 'Старший frontend-разработчик',
  avatar_url:
    'https://api.dicebear.com/9.x/initials/svg?seed=%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80%20%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2',
  status: USER_STATUSES.ACTIVE,
  role: USER_ROLES.USER,
};

export const mockAdminDto: UserDto = {
  id: 'admin-irina-kovaleva',
  employee_id: 'ADM-0101',
  first_name: 'Ирина',
  last_name: 'Ковалёва',
  middle_name: 'Андреевна',
  email: 'admin@futurepass.app',
  phone: '+7 (999) 777-10-10',
  department: 'Служба безопасности',
  position: 'Администратор системы пропусков',
  avatar_url:
    'https://api.dicebear.com/9.x/initials/svg?seed=%D0%98%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9A%D0%BE%D0%B2%D0%B0%D0%BB%D1%91%D0%B2%D0%B0',
  status: USER_STATUSES.ACTIVE,
  role: USER_ROLES.ADMIN,
};

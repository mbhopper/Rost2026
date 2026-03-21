const ensureDate = (value) => value instanceof Date ? value : new Date(value);
export function format(value, template) {
  const date = ensureDate(value);
  if (Number.isNaN(date.getTime())) return '';
  if (template === 'dd MMM yyyy') {
    return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }
  if (template === 'HH:mm') {
    return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(date);
  }
  return date.toISOString();
}
export function formatDistanceToNow(value, options = {}) {
  const date = ensureDate(value);
  const diffMinutes = Math.max(0, Math.round((date.getTime() - Date.now()) / 60000));
  const label = diffMinutes < 60 ? `${diffMinutes} мин.` : `${Math.round(diffMinutes / 60)} ч.`;
  return options.addSuffix ? `через ${label}` : label;
}

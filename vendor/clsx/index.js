export function clsx(...inputs) {
  const classes = [];
  const append = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(append);
      return;
    }
    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, active]) => active && classes.push(key));
      return;
    }
    classes.push(String(value));
  };
  inputs.forEach(append);
  return classes.join(' ');
}
export default clsx;

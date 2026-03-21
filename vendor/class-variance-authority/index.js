import { clsx } from 'clsx';
export function cva(base = '', config = {}) {
  return (props = {}) => {
    const classes = [base];
    const variants = config.variants ?? {};
    for (const [variantName, variantMap] of Object.entries(variants)) {
      const value = props[variantName] ?? config.defaultVariants?.[variantName];
      if (value !== undefined && variantMap[value] !== undefined) {
        classes.push(variantMap[value]);
      }
    }
    if (props.className) classes.push(props.className);
    return clsx(classes);
  };
}

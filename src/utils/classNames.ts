export const classNames = (...args: any[]) => {
  const classes: Array<string> = [];
  args.forEach((arg) => {
    if (arg) {
      if (typeof arg === 'string') {
        classes.push(arg);
      } else if (Array.isArray(arg)) {
        if (arg.length) {
          const inner = classNames(...arg);
          if (inner) {
            classes.push(inner);
          }
        }
      } else if (typeof arg === 'object') {
        if (arg.toString !== Object.prototype.toString) {
          classes.push(arg.toString());
        } else {
          Object.entries(arg).filter(([{}, v]) => !!v)
            .forEach(([k]) => classes.push(k));
        }
      }
    }
  });
  return classes.join(' ');
};

export default classNames;

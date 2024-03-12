/**
 * Concatenates the given arguments into a space-separated string of class names.
 *
 * The `classNames` function handles different types of arguments:
 *  - If an argument is a string, it is considered a class name and added to the final result.
 *  - If an argument is an array, the `classNames` function is recursively called with the array elements as arguments.
 *  - If an argument is an object, its property keys are added as class names if the associated values are truthy.
 *
 * @param {...any} args - The arguments to concatenate into class names.
 * @returns {string} - The concatenated string of class names.
 */
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

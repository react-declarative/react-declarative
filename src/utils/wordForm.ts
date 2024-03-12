interface IWordForm {
  one: string;
  two?: string;
  many: string;
}

/**
 * Returns a word form based on a given number value.
 *
 * @param value - The number value to determine the word form for.
 * @param options - The options object.
 * @param options.one - The word form for when the value is 1.
 * @param options.many - The word form for when the value is 0 or ends with 0, or when the value is between 11 and 20 (inclusive).
 * @param [options.two=options.many] - The word form for when the value ends with 2 (e.g., 12, 22, 32).
 * @return The word form with the given number value.
 */
export const wordForm = (value: number, {
  one,
  many,
  two = many,
}: IWordForm) => {

  const getWord = () => {
    if (value === 0 || (value >= 11 && value < 20)) return many
    let lastDigit = value % 10
    if (lastDigit === 0) return many
    if (lastDigit === 1) return one
    if (lastDigit < 5) return two
    return many
  };

  return `${value} ${getWord()}`;
};

export default wordForm;

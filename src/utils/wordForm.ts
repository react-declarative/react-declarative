interface IWordForm {
  one: string;
  two?: string;
  many: string;
}

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

export const replaceString = (str: string, from: string, to: string) =>
  str.split(from).join(to);

export default replaceString;

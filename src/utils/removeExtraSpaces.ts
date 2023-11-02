export const removeExtraSpaces = (str: string) => {
  let prevLength;
  do {
    prevLength = str.length;
    str = str.split("  ").join(" ");
  } while (prevLength !== str.length);
  return str;
};

export default removeExtraSpaces;

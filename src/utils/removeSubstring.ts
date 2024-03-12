/**
 * Removes specified substrings from a given text.
 *
 * @param {string} text - The input text to remove substrings from.
 * @param {...string} remove - One or more substrings to remove from the text.
 * @return {string} - The modified text with the specified substrings removed.
 */
export const removeSubstring = (text: string, ...remove: string[]) => {
  let result = text;
  remove.forEach((item) => (result = result.split(item).join("").trim()));
  return result;
};

export default removeSubstring;

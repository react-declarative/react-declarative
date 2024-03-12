/**
 * Removes specified substrings from a given text.
 *
 * @param text - The input text to remove substrings from.
 * @param remove - One or more substrings to remove from the text.
 * @return - The modified text with the specified substrings removed.
 */
export const removeSubstring = (text: string, ...remove: string[]) => {
  let result = text;
  remove.forEach((item) => (result = result.split(item).join("").trim()));
  return result;
};

export default removeSubstring;

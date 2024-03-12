/**
 * Retrieves the first element matching the given XPath expression.
 *
 * @param {string} xpath - The XPath expression to match the element(s).
 * @returns {Element|null} - The first element that matches the XPath expression, or null if no match is found.
 */
export const getElementFromXPath = (xpath: string) =>
    document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

export default getElementFromXPath;

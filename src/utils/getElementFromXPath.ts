export const getElementFromXPath = (xpath: string) =>
    document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

export default getElementFromXPath;

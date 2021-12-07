export const getXPathFromElement = (element: HTMLElement): string | null => {
    if (element.tagName == "HTML") return "/HTML[1]";
    if (element === document.body) return "/HTML[1]/BODY[1]";
    let ix = 0;
    const siblings = element.parentNode?.childNodes || [];
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i] as HTMLElement;
      if (sibling === element && element.parentNode)
        return (
          getXPathFromElement(element.parentNode as HTMLElement) +
          "/" +
          element.tagName +
          "[" +
          (ix + 1) +
          "]"
        );
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
    }
    return null;
};

export default getXPathFromElement;

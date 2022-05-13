export class ScrollManager {

    private scrollRef: HTMLElement | null = null;

    private lastScrollTop = 0;
    private lastScrollLeft = 0;

    constructor(targetRef: HTMLElement, keepScroll?: boolean, closest?: string) {
        let { parentElement: element } = targetRef;
        if (keepScroll && element) {
            element = closest ? (element.closest(closest) || element) : element;
            this.scrollRef = this.findScrollParent(element);
            this.saveScrollPos();
        }
    };

    private saveScrollPos = () => {
        const { 
            scrollTop: lastScrollTop = -1,
            scrollLeft: lastScrollLeft = -1,
        } = this.scrollRef || {};
        this.lastScrollTop = lastScrollTop;
        this.lastScrollLeft = lastScrollLeft;
    };

    private findScrollParent = (element: HTMLElement): HTMLElement | null  => {
        const { 
            scrollWidth,
            clientWidth,
            scrollHeight,
            clientHeight,
            parentElement,
        } = element;
        let isOk = scrollWidth > clientWidth && clientWidth > 0;
        isOk = isOk || (scrollHeight > clientHeight && clientHeight > 0);
        if (isOk) {
            return element;
        } else if (parentElement) {
            return this.findScrollParent(parentElement);
        } else {
            return null;
        }
    };

    rollbackPos = () => {
        this.scrollRef?.scrollTo(this.lastScrollLeft, this.lastScrollTop);
    };

};

export default ScrollManager;

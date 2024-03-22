/**
 * Scroll Manager
 * Manages the scrolling behavior of a given HTML element.
 */
export const createScrollManager = () => new class {

    _currentElement?: HTMLElement;

    _lastScrollX = 0;

    /**
     * Handles scrolling of the element.
     *
     * @function _handleScroll
     * @memberof ClassName
     *
     * @description This function is responsible for handling the scrolling of the element.
     * It retrieves the scrollLeft value of the element, and updates the _lastScrollX property.
     */
    _handleScroll = () => {
        if (this._currentElement) {
            const { scrollLeft } = this._currentElement;
            this._lastScrollX = scrollLeft;
        }
    };

    /**
     * Adds a provided reference element to the scrollable
     * list and attaches a scroll event listener to it.
     *
     * @param element - The element to be added as a reference.
     * An HTML element or null.
     */
    provideRef = (element: HTMLElement | null) => {
        this.clear();
        if (element) {
            element.addEventListener('scroll', this._handleScroll, {
                passive: true,
            });
            this._currentElement = element;
        }
    };

    /**
     * Scrolls the current element to the specified x-coordinate.
     *
     * @memberof YourClass
     * @method
     * @name scrollTop
     * @returns
     */
    scrollTop = () => {
        if (this._currentElement) {
            this._currentElement.scrollTo(this._lastScrollX, 0);
        }
    };

    /**
     * Clears the current element and removes event listener for scroll.
     *
     * @function clear
     */
    clear = () => {
        if (this._currentElement) {
            this._currentElement.removeEventListener('scroll', this._handleScroll);
        }
        this._currentElement = undefined;
    };

};

export default createScrollManager;

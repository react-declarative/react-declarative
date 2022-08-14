export const createScrollManager = () => new class {

    _currentElement?: HTMLElement;

    _lastScrollX = 0;

    _handleScroll = () => {
        if (this._currentElement) {
            const { scrollLeft } = this._currentElement;
            this._lastScrollX = scrollLeft;
        }
    };

    provideRef = (element: HTMLElement | null) => {
        this.clear();
        if (element) {
            element.addEventListener('scroll', this._handleScroll, {
                passive: true,
            });
            this._currentElement = element;
        }
    };

    scrollTop = () => {
        if (this._currentElement) {
            this._currentElement.scrollTo(this._lastScrollX, 0);
        }
    };

    clear = () => {
        if (this._currentElement) {
            this._currentElement.removeEventListener('scroll', this._handleScroll);
        }
        this._currentElement = undefined;
    };

};

export default createScrollManager;

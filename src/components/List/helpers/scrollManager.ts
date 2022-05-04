export const scrollManager = new class {

    _currentElement?: HTMLElement;

    _lastScrollX = 0;
    _lastScrollY = 0;

    _handleScroll = () => {
        if (this._currentElement) {
            const { scrollTop, scrollLeft } = this._currentElement;
            this._lastScrollX = scrollLeft;
            this._lastScrollY = scrollTop;
        }
    }

    provideRef = (element: HTMLElement | null) => {
        this.clear();
        if (element) {
            element.addEventListener('scroll', this._handleScroll);
            this._currentElement = element;
            element.scrollTo(this._lastScrollX, this._lastScrollY);
        }
    };

    scrollTop = () => {
        this._lastScrollY = 0;
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

export default scrollManager;

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';


export const createWebComponent = (name: string, Root: React.ComponentType<any>) => {
    function CustomTagFactory() {
        const self: HTMLSpanElement = Reflect.construct(
            HTMLElement,
            [],
            CustomTagFactory
        );
        return self;
    }
    CustomTagFactory.prototype = Object.create(HTMLElement.prototype);
    CustomTagFactory.prototype.connectedCallback = function() {
        const mountPoint = document.createElement('div');
        this.attachShadow({ mode: 'open' }).appendChild(mountPoint);
        const params = {...this.dataset};
        const root = ReactDOM.createRoot(mountPoint);
        root.render(<Root {...params} />);
    };
    customElements.define(name, CustomTagFactory as any);
};

export default createWebComponent;

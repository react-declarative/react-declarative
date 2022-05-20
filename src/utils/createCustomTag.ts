export const createCustomTag = (name = "bgcolor-red", style = "") => {
    function CustomTagFactory() {
        const self: HTMLSpanElement = Reflect.construct(
            HTMLElement,
            [],
            CustomTagFactory
        );
        self.setAttribute("style", style);
        return self;
    }
    CustomTagFactory.prototype = Object.create(HTMLElement.prototype);
    customElements.define(name, CustomTagFactory as any);
};

export default createCustomTag;

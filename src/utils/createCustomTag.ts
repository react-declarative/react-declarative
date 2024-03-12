interface IConfig {
    onClick: (e: MouseEvent) => void;
    onInit: (element: HTMLDivElement) => void;
}

/**
 * Creates a custom HTML tag element with the given name, style, and optional event handlers.
 *
 * @param {string} [name="bgcolor-red"] - The name of the custom HTML tag element.
 * @param {string} [style=""] - The inline style to apply to the custom HTML tag element.
 * @param {Partial<IConfig>} [{ onClick, onInit }={}] - Optional event handlers for the custom HTML tag element.
 */
export const createCustomTag = (name = "bgcolor-red", style = "", {
    onClick,
    onInit,
}: Partial<IConfig> = {}) => {
    function CustomTagFactory() {
        const self: HTMLDivElement = Reflect.construct(
            HTMLElement,
            [],
            CustomTagFactory
        );
        self.setAttribute("style", style);
        if (onInit) {
            onInit(self);
        }
        if (onClick) {
            self.onclick = onClick;
        }
        return self;
    }
    CustomTagFactory.prototype = Object.create(HTMLElement.prototype);
    customElements.define(name, CustomTagFactory as any);
};

export default createCustomTag;

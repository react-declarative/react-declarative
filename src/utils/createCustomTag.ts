interface IConfig {
    onClick: (e: MouseEvent) => void;
    onInit: (element: HTMLDivElement) => void;
}

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

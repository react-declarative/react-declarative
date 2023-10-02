interface IConfig {
    onClick: (e: MouseEvent) => void;
}

export const createCustomTag = (name = "bgcolor-red", style = "", {
    onClick,
}: Partial<IConfig> = {}) => {
    function CustomTagFactory() {
        const self: HTMLSpanElement = Reflect.construct(
            HTMLElement,
            [],
            CustomTagFactory
        );
        self.setAttribute("style", style);
        if (onClick) {
            self.onclick = onClick;
        }
        return self;
    }
    CustomTagFactory.prototype = Object.create(HTMLElement.prototype);
    customElements.define(name, CustomTagFactory as any);
};

export default createCustomTag;

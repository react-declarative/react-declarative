import debounce from "./hof/debounce";
import singleshot from "./hof/singleshot";

import Subject from "./rx/Subject";

const DOM_DEBOUNCE = 1_000;

type Destructor = () => void;

/**
 * Interface representing a configuration object.
 *
 * @typedef IConfig
 * @property onClick - The event handler for the click event.
 * @param onClick.e - The MouseEvent object representing the click event.
 * @property onInit - The event handler for the initialization event.
 * @param onInit.element - The HTMLDivElement object representing the element that was initialized.
 */
interface IConfig {
    onClick: (e: MouseEvent) => void;
    onInit: (element: HTMLDivElement) => (void | Destructor);
}

/**
 * Listens for DOM changes and emits an event when changes occur.
 * 
 * This function uses a single-shot listener to observe mutations in the
 * document body, specifically targeting child list changes within the
 * subtree. It debounces the emissions to reduce the frequency of events
 * triggered during rapid changes.
 * 
 * @returns A subject that emits a notification when
 *          a mutation is detected in the DOM.
 */
const listenDOM = singleshot(() => {
    const resultSubject = new Subject<void>();
    const mObserver = new MutationObserver(debounce(() => resultSubject.next(), DOM_DEBOUNCE));
    mObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
    return resultSubject;
});

/**
 * Waits for a specific HTMLDivElement to be removed from the DOM
 * and then executes a provided destructor function.
 * 
 * This function subscribes to DOM changes and checks if the specified
 * element is still in the document. If the element is dismounted,
 * it unsubscribes from the listener and calls the destructor.
 *
 * @param self - The HTMLDivElement to monitor for
 *                                 removal from the DOM.
 * @param destructor - A function to be called when the
 *                     element is removed from the DOM.
 */
const waitForDismount = (self: HTMLDivElement, destructor: Destructor) => {
    const unsubscribe = listenDOM().subscribe(() => {
        if (!document.contains(self)) {
            unsubscribe();
            destructor();
        }
    });
};

/**
 * Creates a custom HTML tag element with the given name, style, and optional event handlers.
 *
 * @param [name="bgcolor-red"] - The name of the custom HTML tag element.
 * @param [style=""] - The inline style to apply to the custom HTML tag element.
 * @param [{ onClick, onInit }={}] - Optional event handlers for the custom HTML tag element.
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
            const destructor = onInit(self);
            if (typeof destructor === 'function') {
                waitForDismount(self, destructor);
            }
        }
        if (onClick) {
            self.onclick = onClick;
        }
        return self;
    }
    if ("HTMLElement" in globalThis) {
        CustomTagFactory.prototype = Object.create(HTMLElement.prototype);
        customElements.define(name, CustomTagFactory as any);
    }
};

export default createCustomTag;

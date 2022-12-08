import createScrollManager from "../helpers/createScrollManager";
import createValueProvider from "../../../utils/createValueProvider";

type ScrollManager = ReturnType<typeof createScrollManager>;

const [ ScrollManagerProvider, useScrollManager ] = createValueProvider<ScrollManager>();

export { ScrollManagerProvider, useScrollManager };

export default useScrollManager;

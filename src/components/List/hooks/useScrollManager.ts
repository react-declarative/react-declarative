import createScrollManager from "../helpers/createScrollManager";
import createProvider from "../../../utils/createProvider";

type ScrollManager = ReturnType<typeof createScrollManager>;

const [ ScrollManagerProvider, useScrollManager ] = createProvider<ScrollManager>();

export { ScrollManagerProvider, useScrollManager };

export default useScrollManager;

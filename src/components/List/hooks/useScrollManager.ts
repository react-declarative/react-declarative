import { createStatelessProvider } from "../../../utils/createProvider";

import createScrollManager from "../helpers/createScrollManager";

type ScrollManager = ReturnType<typeof createScrollManager>;

const [ ScrollManagerProvider, useScrollManager ] = createStatelessProvider<ScrollManager>();

export { ScrollManagerProvider, useScrollManager };

export default useScrollManager;

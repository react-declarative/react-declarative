import { createStatelessProvider } from "../../../utils/createProvider";

import createScrollManager from "../helpers/scrollManager";

type ScrollManager = ReturnType<typeof createScrollManager>;

const [ ScrollManagerProvider, useScrollManager ] = createStatelessProvider<ScrollManager>();

export { ScrollManagerProvider, useScrollManager };

export default useScrollManager;

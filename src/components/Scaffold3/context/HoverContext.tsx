import createStateProvider from "../../../utils/createStateProvider";

export const [HoverContextProvider, useHoverContext] = createStateProvider<string>();

export default useHoverContext;

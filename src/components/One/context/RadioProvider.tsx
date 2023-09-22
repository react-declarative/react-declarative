import { createStateProvider } from "../../../utils/createStateProvider";

export const [RadioProvider, useOneRadio] = createStateProvider<Record<string, string | null>>()

export default RadioProvider;

import { createStatelessProvider } from "../../../utils/createProvider";

export const [LoaderProvider, useLoader] = createStatelessProvider<number>();

export default useLoader;

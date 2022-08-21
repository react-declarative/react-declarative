import { createStatelessProvider } from "../../../utils/createProvider";

export const [LoaderProvider, useLoader] = createStatelessProvider<boolean>();

export default useLoader;

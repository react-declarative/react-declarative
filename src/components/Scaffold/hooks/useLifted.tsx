import { createStatelessProvider } from "../../../utils/createProvider";

export const [LiftedProvider, useLifted] = createStatelessProvider<boolean>();

export default useLifted;

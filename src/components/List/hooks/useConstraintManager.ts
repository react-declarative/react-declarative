import { createStatelessProvider } from "../../../utils/createProvider";

import createConstraintManager from "../helpers/createConstraintManager";

type ConstraintManager = ReturnType<typeof createConstraintManager>;

const [ ConstraintManagerProvider, useConstraintManager ] = createStatelessProvider<ConstraintManager>();

export { ConstraintManagerProvider, useConstraintManager };

export default useConstraintManager;

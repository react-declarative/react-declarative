import createConstraintManager from "../helpers/createConstraintManager";

import createProvider from "../../../utils/createProvider";

type ConstraintManager = ReturnType<typeof createConstraintManager>;

const [ ConstraintManagerProvider, useConstraintManager ] = createProvider<ConstraintManager>();

export { ConstraintManagerProvider, useConstraintManager };

export default useConstraintManager;

import createConstraintManager from "../helpers/createConstraintManager";

import createValueProvider from "../../../utils/createValueProvider";

type ConstraintManager = ReturnType<typeof createConstraintManager>;

const [ ConstraintManagerProvider, useConstraintManager ] = createValueProvider<ConstraintManager>();

export { ConstraintManagerProvider, useConstraintManager };

export default useConstraintManager;

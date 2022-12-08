import createValueProvider from "../../../utils/createValueProvider";

import IListProps from '../../../model/IListProps';

const [ PayloadProvider, usePayload ] = createValueProvider<Exclude<IListProps['payload'], undefined>>();

export { PayloadProvider, usePayload };

export default usePayload;

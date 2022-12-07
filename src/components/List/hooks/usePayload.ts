import createProvider from "../../../utils/createProvider";

import IListProps from '../../../model/IListProps';

const [ PayloadProvider, usePayload ] = createProvider<Exclude<IListProps['payload'], undefined>>();

export { PayloadProvider, usePayload };

export default usePayload;

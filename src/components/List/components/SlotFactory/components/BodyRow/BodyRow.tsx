import * as React from 'react';

import IAnything from '../../../../../../model/IAnything';
import IRowData from '../../../../../../model/IRowData';

import DesktopBodyRow from './components/DesktopBodyRow';

import { IBodyRowSlot } from '../../../../slots/BodyRowSlot';

export const BodyRow = <RowData extends IRowData = IAnything>(props: IBodyRowSlot<RowData>) => {
    return (
        <DesktopBodyRow<RowData>
            {...props}
        />
    );
};

export default BodyRow;

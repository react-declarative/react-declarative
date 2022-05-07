import * as React from 'react';

import DisplayMode from '../../../../../../model/DisplayMode';

import IAnything from '../../../../../../model/IAnything';
import IRowData from '../../../../../../model/IRowData';

import DesktopBodyRow from './components/DesktopBodyRow';
import MobileBodyRow from './components/MobileBodyRow';

import { IBodyRowSlot } from '../../../../slots/BodyRowSlot';

export const BodyRow = <RowData extends IRowData = IAnything>(props: IBodyRowSlot<RowData>) => {
    if (props.mode === DisplayMode.Phone) {
        return (
            <MobileBodyRow<RowData>
                {...props}
            />
        );
    } else {
        return (
            <DesktopBodyRow<RowData>
                {...props}
            />
        );
    }
};

export default BodyRow;

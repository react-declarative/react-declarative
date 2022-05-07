import * as React from 'react';

import DisplayMode from '../../../../../../model/DisplayMode';

import { IHeadRowSlot } from '../../../../slots/HeadRowSlot';

import DesktopHeadRow from './components/DesktopHeadRow';
import MobileHeadRow from './components/MobileHeadRow';

export const HeadRow = (props: IHeadRowSlot) => {
    if (props.mode === DisplayMode.Phone) {
        return (
            <MobileHeadRow
                {...props}
            />
        );
    } else {
        return (
            <DesktopHeadRow
                {...props}
            />
        );
    }
};

export default HeadRow;

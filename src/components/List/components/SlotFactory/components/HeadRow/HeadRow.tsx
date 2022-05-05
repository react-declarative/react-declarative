import * as React from 'react';

import { IHeadRowSlot } from '../../../../slots/HeadRowSlot';

import DesktopHeadRow from './components/DesktopHeadRow';

export const HeadRow = (props: IHeadRowSlot) => {
    return (
        <DesktopHeadRow
            {...props}
        />
    )
};

export default HeadRow;

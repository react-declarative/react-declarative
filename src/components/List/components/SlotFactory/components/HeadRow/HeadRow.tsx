import * as React from 'react';

import DisplayMode from '../../../../../../model/DisplayMode';

import { IHeadRowSlot } from '../../../../slots/HeadRowSlot';

import DesktopHeadRow from './components/DesktopHeadRow';
import MobileHeadRow from './components/MobileHeadRow';

import useProps from '../../../../hooks/useProps';

export const HeadRow = (props: IHeadRowSlot) => {
    const { withMobile = false } = useProps();
    if (props.mode === DisplayMode.Phone && withMobile) {
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

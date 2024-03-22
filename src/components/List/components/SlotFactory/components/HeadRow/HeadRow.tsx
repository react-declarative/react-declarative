import * as React from 'react';

import DisplayMode from '../../../../../../model/DisplayMode';

import { IHeadRowSlot } from '../../../../slots/HeadRowSlot';

import DesktopHeadRow from './components/DesktopHeadRow';
import MobileHeadRow from './components/MobileHeadRow';

import useProps from '../../../../hooks/useProps';

/**
 * Function that renders the header row component based on the given props.
 *
 * @param props - The props for the header row component.
 * @returns - The rendered header row component.
 */
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

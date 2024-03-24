import * as React from 'react';

import useMediaContext from '../../../../hooks/useMediaContext';

import DesktopContent from './components/DesktopContent';
import MobileContent from './components/MobileContent';
import CardContent from './components/CardContent';
import TabContent from './components/TabContent';

import MasterDetailMode from '../../model/MasterDetailMode';

import IContentProps from './IContentProps';
/**
 * The Content component is responsible for rendering the appropriate content based on the provided props.
 *
 * @param props - The props object containing the necessary data.
 * @param props.mode - The mode of the content (Tabs, Outline, or Paper).
 * @param props.isMobile - A flag indicating if the device is a mobile device.
 * @param props.items - An array of items.
 *
 * @returns - The rendered content based on the provided props.
 */
export const Content = (props: IContentProps) => {
    const { isMobile } = useMediaContext();

    if (props.mode === MasterDetailMode.Tabs) {
        return <TabContent {...props} />
    }

    if (props.mode === MasterDetailMode.Outline) {
        return <CardContent {...props} />;
    }

    if (props.mode === MasterDetailMode.Paper) {
        return <CardContent {...props} />;
    }

    if (isMobile || !props.items.length) {
        return <MobileContent {...props} />
    }

    return <DesktopContent {...props} />;
};

export default Content;

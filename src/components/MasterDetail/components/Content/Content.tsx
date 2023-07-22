import * as React from 'react';

import useMediaContext from '../../../../hooks/useMediaContext';

import DesktopContent from './components/DesktopContent';
import MobileContent from './components/MobileContent';
import CardContent from './components/CardContent';
import MasterDetailMode from '../../model/MasterDetailMode';

import IContentProps from './IContentProps';

export const Content = (props: IContentProps) => {
    const { isMobile } = useMediaContext();

    if (props.mode === MasterDetailMode.Outline) {
        return <CardContent {...props} />;
    }

    if (props.mode === MasterDetailMode.Paper) {
        return <CardContent {...props} />;
    }

    if (isMobile) {
        return <MobileContent {...props} />
    }

    return <DesktopContent {...props} />;
};

export default Content;

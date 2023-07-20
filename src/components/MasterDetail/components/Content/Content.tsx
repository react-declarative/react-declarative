import * as React from 'react';

import useMediaContext from '../../../../hooks/useMediaContext';

import DesktopContent from './components/DesktopContent';
import MobileContent from './components/MobileContent';

import IContentProps from './IContentProps';

export const Content = (props: IContentProps) => {
    const { isMobile } = useMediaContext();

    if (isMobile) {
        return <MobileContent {...props} />
    }

    return <DesktopContent {...props} />;
};

export default Content;

import React from 'react';

import LayoutGrid from './pages/LayoutPage';

export const Router = ({
    route = '',
}) => {
    if (route === 'layout-grid') {
        return <LayoutGrid />;
    } else {
        return null;
    }
}

export default Router;

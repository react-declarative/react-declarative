import React from 'react';

import LayoutGrid from './pages/LayoutPage';
import GalleryPage from './pages/GalleryPage';
import ValidationPage from './pages/ValidationPage';

export const Router = ({
    route = '',
}) => {
    if (route === 'layout-page') {
        return <LayoutGrid />;
    } else if (route === 'validation-page') {
        return <ValidationPage/>;
    } else if (route === 'gallery-page') {
        return <GalleryPage/>;
    } else {
        return null;
    }
}

export default Router;

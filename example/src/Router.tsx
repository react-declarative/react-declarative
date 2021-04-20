import React from 'react';

import SamplePage from './pages/SamplePage';
import LayoutGrid from './pages/LayoutPage';
import GalleryPage from './pages/GalleryPage';
import ValidationPage from './pages/ValidationPage';
import LoginPage from './pages/LoginPage';

export const Router = ({
    route = '',
}) => {
    if (route === 'layout-page') {
        return <LayoutGrid />;
    } else if (route === 'validation-page') {
        return <ValidationPage/>;
    } else if (route === 'gallery-page') {
        return <GalleryPage/>;
    } else if (route === 'sample-page') {
        return <SamplePage/>;
    } else if (route === 'login-page') {
        return <LoginPage/>;
    } else {
        return null;
    }
}

export default Router;

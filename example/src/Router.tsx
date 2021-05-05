import React from 'react';

import SamplePage from './pages/SamplePage';
import LayoutGrid from './pages/LayoutPage';
import GalleryPage from './pages/GalleryPage';
import ValidationPage from './pages/ValidationPage';
import LoginPage from './pages/LoginPage';
import HeroPage from './pages/HeroPage';
import ListPage from './pages/ListPage';

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
    } else if (route === 'hero-page') {
        return <HeroPage/>;
    } else if (route === 'list-page') {
        return <ListPage/>;
    } else {
        return null;
    }
}

export default Router;

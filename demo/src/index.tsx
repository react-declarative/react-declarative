import React from 'react';

import { createRoot } from 'react-dom/client';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ModalProvider, SnackProvider, SearchModal } from 'react-declarative';

import App from './App'
import _mock from './pages/mock/list';
import { columns, filters } from './pages/ListPage';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90cbf9',
        },
        secondary: {
            main: '#90cbf9',
        },
        text: {
            primary: "#fff",
            secondary: "rgba(255, 255, 255, 0.7)",
            disabled: "rgba(255, 255, 255, 0.5)",
        },
        background: {
            paper: "#424242",
            default: "#212121",
        },
    },
});

const container = document.getElementById('root')!;

console.log(SearchModal);

const wrappedApp = (
    <ThemeProvider theme={theme}>
        <ModalProvider>
            <SnackProvider>
                <SearchModal
                    handler={() => _mock}
                    filters={filters}
                    columns={columns}
                />  
            </SnackProvider>
        </ModalProvider>
    </ThemeProvider>
);

/*
createWebComponent("frontend-widget", (params) => (
    <pre>
        {JSON.stringify(params, null, 2)}
    </pre>
));
*/

const root = createRoot(container);

root.render(wrappedApp);

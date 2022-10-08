import React from 'react';

import { createRoot } from 'react-dom/client';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ModalProvider, SnackProvider } from 'react-declarative';

import App from './App'

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

const container = document.getElementById('root');

const wrappedApp = (
    <ThemeProvider theme={theme}>
        <ModalProvider>
            <SnackProvider>
                <App />
            </SnackProvider>
        </ModalProvider>
    </ThemeProvider>
);

const root = createRoot(container);

root.render(wrappedApp);

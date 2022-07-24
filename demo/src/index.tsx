import ReactDOM from 'react-dom'

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ModalProvider, createServiceManager } from 'react-declarative';

import App from './App'

const theme = createTheme({
    /*palette: {
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
    },*/
});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <ModalProvider>
            <App />
        </ModalProvider>
    </ThemeProvider>,
    document.getElementById('root')
);

(window as any).createServiceManager = createServiceManager;

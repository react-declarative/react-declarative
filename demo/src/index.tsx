import ReactDOM from 'react-dom'

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ModalProvider } from 'react-declarative';

import App from './App'

const theme = createTheme();

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <ModalProvider>
            <App />
        </ModalProvider>
    </ThemeProvider>,
    document.getElementById('root')
);

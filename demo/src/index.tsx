import ReactDOM from 'react-dom'
import App from './App'

import { ModalProvider } from 'react-declarative';

ReactDOM.render(
    <ModalProvider>
        <App />
    </ModalProvider>,
    document.getElementById('root')
);

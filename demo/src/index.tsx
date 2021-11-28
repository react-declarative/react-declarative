import ReactDOM from 'react-dom'
import App from './App'

import { i18nMap, ModalProvider } from 'react-declarative';

// i18nMap["OK"] = "Применить";
// i18nMap["Cancel"] = "Отмена";

ReactDOM.render(
    <ModalProvider>
        <App />
    </ModalProvider>,
    document.getElementById('root')
);

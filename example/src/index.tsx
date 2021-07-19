import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { i18nMap } from 'react-view-builder';

i18nMap["OK"] = "Применить";
i18nMap["Cancel"] = "Отмена";

ReactDOM.render(<App />, document.getElementById('root'))

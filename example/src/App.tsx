import React from 'react'
import {One, FieldType, IField} from 'react-view-builder';

const fields: IField[] = [
  {
    type: FieldType.Text,
    name: 'omg'
  },
];

const App = () => {
  return <One fields={fields} />
}

export default App

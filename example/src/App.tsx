import React from 'react'
import One, {FieldType, IField} from 'react-view-builder';

const fields: IField[] = [
  {
    type: FieldType.Group,
  }
]

const App = () => {
  return <One fields={fields} />
}

export default App

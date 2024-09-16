# The evolution of JsonForms approach in react-declarative

The reference article from jsonforms documentation could be seen [by the link](https://jsonforms.io/docs/middleware/)

## Code sample in json forms

The signifficant diffrence between `jsonforms` and `react-declarative` is the lower entry threshold. For example, when you coding with jsonforms you will have to specify form schema and data schema manually. The `react-declarative` does not require data schema which is more native way of the development cause we have TypeScript interfaces.

1. `uischema.json`

```json
{
  "type": "Object",
  "properties": {
    "services": {
      "type": "Object",
      "properties": {
        "wash": {
          "type": "Control",
          "label": "Wash",
          "scope": "#/properties/services/properties/wash",
          "options": {
            "type": "checkbox"
          }
        },
        "polish": {
          "type": "Control",
          "label": "Polish",
          "scope": "#/properties/services/properties/polish",
          "options": {
            "type": "checkbox"
          }
        },
        "interior": {
          "type": "Control",
          "label": "Interior",
          "scope": "#/properties/services/properties/interior",
          "options": {
            "type": "checkbox"
          }
        }
      }
    },
    "price": {
      "type": "Control",
      "label": "Price",
      "scope": "#/properties/price",
      "options": {
        "type": "number"
      }
    }
  }
}
```

2. `schema.json`

```json
{
  "type": "object",
  "properties": {
    "services": {
      "type": "array",
      "uniqueItems": true,
      "items": {
        "oneOf": [
          {
            "const": "Wash (15$)"
          },
          {
            "const": "Polish (15$)"
          },
          {
            "const": "Interior (15$)"
          }
        ]
      }
    },
    "price": {
      "type": "number",
      "readOnly": true
    }
  }
}
```

This is bad. But if we talk about data bindings in jsonforms it become awful cause you need to implement redux-like middlewares. This is legacy way of the development which will break your app by destroying function pureness [by new code addition side effect](./code-sideeffect.md)

```tsx
import { INIT, UPDATE_DATA } from  '@jsonforms/core'

...
const middleware = useCallback((state, action, defaultReducer) => {
  const newState = defaultReducer(state, action);
  switch (action.type) {
    case INIT:
    case UPDATE_CORE:
    case UPDATE_DATA: {
      if (newState.data.services.length * 15 !== newState.data.price) {
        newState.data.price = newState.data.services.length * 15;
      }
      return newState;
    }
    default:
      return newState;
  }
});

...

<JsonForms
  data={data}
  schema={schema}
  renderers={materialRenderers}
  middleware={middleware}
/>
```

## The same form in react-declarative way

This code is shorten. This code is easier to understand. It is functionally pure. It is your choice

```tsx
import { TypedField, FieldType, One } from "react-declarative";

export const fields: TypedField[] = [
  {
    type: FieldType.Typography,
    typoVariant: 'caption',
    placeholder: 'Services',
  },
  {
    type: FieldType.Box,
    sx: {
      display: 'grid',
      gridTemplateColumns: 'auto auto auto 1fr'
    },
    fields: [
      {
        type: FieldType.Checkbox,
        name: 'wash',
      },
      {
        type: FieldType.Checkbox,
        name: 'polish',
      },
      {
        type: FieldType.Checkbox,
        name: 'interior',
      }
    ]
  },
  {
    type: FieldType.Text,
    title: 'Price',
    compute: ({
      wash,
      polish,
      interior,
    }) => {
      let total = 0;
      if (wash) {
        total += 15;
      }
      if (polish) {
        total += 15;
      }
      if (interior) {
        total += 15;
      }
      return `${total}$`
    },
  }
];

<One
    fields={fields}
/>

```

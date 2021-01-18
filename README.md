# react-view-builder

> A port of [theonekit](https://theonekit.com/) from TypeScript Namespaces to ES6 modules. Check this site for more samples...

An React form builder that interfaces with a json endpoint to generate 12 column nested grid with input fields and automatic state management. Json endpoint is typed by typescript (**IntelliSense** available)...

## Install

```bash
npm install --save react-view-builder
```

## Usage

```tsx
import React, { Component } from 'react'

import MyComponent from 'react-view-builder'
import 'react-view-builder/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

## License

MIT © [tripolskypetr](https://github.com/tripolskypetr)

# react-view-builder

> [Material-ui](https://material-ui.com/) json endpoint form builder. Check [this site](https://theonekit.com/) for more samples...

An React form builder which interfaces with a json endpoint to generate 12 column based nested grids with input fields and automatic state management. Json endpoint is typed by typescript (**IntelliSense** available). This tool is based on `material-ui` components so your app is going to look pretty on any device...

## Install

> There is a sample app avalible in [example](./example/src/index.tsx) folder...

```bash
npm install --save @tripolskypetr/react-view-builder
```

## Demos

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

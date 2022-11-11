<br />

<img src="./assets/icons/logo.svg" height="35px" align="right">

# ⚛️ react-declarative

> [MUI](https://mui.com/) json endpoint form builder. Check [this storybook](https://github.com/react-declarative/react-declarative-storybook) for more samples...

[![npm](https://img.shields.io/npm/v/react-declarative.svg?style=flat-square)](https://npmjs.org/package/react-declarative)

![meme](./meme.png)

A React form builder which interacts with a JSON endpoint to generate nested 12-column grids with input fields and automatic state management in a declarative style. Endpoint is typed by TypeScript guards (**IntelliSense** available). This tool is based on `MUI` components, so your application will look beautiful on any device...

## Quick start

> There is a `create-react-app` template available [in this repository](https://github.com/react-declarative/cra-template-react-declarative)

```bash
npx create-react-app . --template=react-declarative
```

## Installation

> There is a sample app avalible in [demo](./demo/src/index.tsx) folder...

```bash
npm install --save react-declarative tss-react @mui/material @emotion/react @emotion/styled
```

## Demos

>The `react-declarative` is not just a form builder. This one is a huge framework with dashboard adaptive cards builder, crud-based Grid component and more.

This tool also provide it's own way of rapid application development by simplifying app state managament. New features appear frequently, so you should be able to [read the project's storybook](https://github.com/react-declarative/react-declarative-storybook), browse [an organization with sample projects](https://github.com/react-declarative), and [read the source code](https://github.com/react-declarative/react-declarative).

<img src="./assets/icons/solomon.svg" height="55px" align="right">

## JSON-templated view engine

**1. Layout grid**

> Link to [source code](./demo/src/pages/LayoutPage.tsx)

![layout-grid](./assets/layout.gif)

```tsx
const fields: TypedField[] = [
  {
    type: FieldType.Line,
    title: 'User info',
  },
  {
    type: FieldType.Group,
    phoneColumns: '12',
    tabletColumns: '6',
    desktopColumns: '4',
    fields: [
      {
        type: FieldType.Text,
        title: 'First name',
        defaultValue: 'Petr',
        description: 'Your first name',
        leadingIcon: Face,
        focus() { console.log("focus :-)"); },
        blur() { console.log("blur :-("); },
        name: 'firstName',
      },
      {
        type: FieldType.Text,
        title: 'Last name',
        defaultValue: 'Tripolsky',
        description: 'Your last name',
        name: 'lastName',
      },

      ...

];
```

**2. Form validation**

> Link to [source code](./demo/src/pages/ValidationPage.tsx)

![form-validation](./assets/validation.gif)

```tsx
const fields: TypedField[] = [
  {
    type: FieldType.Text,
    name: 'email',
    trailingIcon: Email,
    defaultValue: 'tripolskypetr@gmail.com',
    isInvalid({email}) {
      const expr = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (!expr.test(email)) {
        return 'Invalid email address';
      } else {
        return null;
      }
    },
    isDisabled({disabled}) {
      return disabled;
    },
    isVisible({visible}) {
      return visible;
    }
},
{
    type: FieldType.Expansion,
    title: 'Settings',
    description: 'Hide or disable',
    fields: [
      {
        type: FieldType.Switch,
        title: 'Mark as visible',
        name: 'visible',
        defaultValue: true,
      },

      ...

```

**3. Gallery of controls**

> Link to [source code](./demo/src/pages/GalleryPage.tsx)

![gallery](./assets/gallery.gif)

```tsx
const fields: TypedField[] = [
  {
    type: FieldType.Paper,
    fields: [
      {
        type: FieldType.Line,
        title: 'Checkboxes',
      },
      {
        type: FieldType.Checkbox,
        name: 'checkbox1',
        columns: '3',
        title: 'Checkbox 1',
      },
      {
        type: FieldType.Checkbox,
        name: 'checkbox2',
        columns: '3',
        title: 'Checkbox 2',
      },

      ...

```

**4. JSX Injection**

> Link to [source code](./demo/src/pages/GalleryPage.tsx)

```tsx
const fields: TypedField[] = [
  {
    type: FieldType.Paper,
    fields: [
      {
        type: FieldType.Component,
        element: (props) => <Logger {...(props || {})}/>, 
      },
    ],
  },

  ...

];
```

<img src="./assets/icons/saturn.svg" height="35px" align="right">

## JSON-templated grid engine

> Link to [source code](./demo/src/pages/ListPage.tsx)

Adaptive json-configurable data grid with build-in mobile device support

![list](./assets/images/list.png)

```tsx

const filters: TypedField[] = [
  {
    type: FieldType.Text,
    name: 'firstName',
    title: 'First name',
  },
  {
    type: FieldType.Text,
    name: 'lastName',
    title: 'Last name',
  }
];

const columns: IColumn[] = [
  {
    type: ColumnType.Text,
    field: 'id',
    headerName: 'ID',
    width: (fullWidth) => Math.max(fullWidth - 650, 200),
    columnMenu: [
      {
        action: 'test-action',
        label: 'Column action',
      },
    ],
  },
  ...
];

const actions: IListAction[] = [
  {
    type: ActionType.Add,
    label: 'Create item'
  },
  ...
];

const operations: IListOperation[] = [
  {
    action: 'operation-one',
    label: 'Operation one',
  },
];

const chips: IListChip[] = [
  {
    label: 'The chip1_enabled is true',
    name: 'chip1_enabled',
    color: '#4caf50',
  },
  ...
];

const rowActions: IListRowAction[] = [
  {
    label: 'chip1',
    action: 'chip1-action',
    isVisible: ({ chip1_enabled }) => chip1_enabled,
  },
  ...
];

...

return (
  <ListTyped
    withMobile
    withSearch
    withArrowPagination
    rowActions={rowActions}
    actions={actions}
    filters={filters}
    columns={columns}
    operations={operations}
    chips={chips}
  />
)

```

<img src="./assets/icons/cubes.svg" height="35px" align="right">

## Async pipe port

> See [angular2 docs](https://angular.io/api/common/AsyncPipe)

```tsx
import { Async } from 'react-declarative'

import { CircularProgress } from '@mui/material'

const PostItem = ({
  id,
}) => {

  const { getPostById } = useBlogApi();

  return (
    <Async payload={id} Loader={CircularProgress}>
      {async (id) => {
        const { title, body } = await getPostById(id);
        return (
          <div>
            <p>{title}</p>
            <p>{body}</p>
          </div>
        );
      }}
    </Async>
  );
};
```

<img src="./assets/icons/triangle.svg" height="35px" align="right">

## Structural directive port

> See [angular2 docs](https://angular.io/guide/structural-directives)

```tsx
import { If } from 'react-declarative'

const ProfilePage = () => {
  const { hasRole } = useRoleApi();
  return (
    <If condition={() => hasRole("admin")}>
      <button>The admin's button</button>
    </If>
  );
};
```

## Animated view transition

> Link to [source code](./demo/src/pages/RevealPage.tsx)

```tsx
import { FetchView } from 'react-declarative'

const PostList = () => {

  const { getPosts } = useBlogApi();

  const state = [
    getPosts,
  ];

  return (
    <FetchView state={state} animation="fadeIn">
      {(posts) => (
        <div>
          {posts.map((post, idx) => (
            <p key={idx}>
              <b>{post.title}</b>
              {post.body}
            </p>
          ))}
        </div>
      )}
    </FetchView>
  );
};
```

## Build-in router

> Link to [source code](./demo/src/App.tsx)

```tsx
import { Switch } from 'react-declarative';

...

const routes = [
  {
    path: '/sample-page',
    prefetch: roleApiManager.init,
    unload: roleApiManager.dispose,
  },
];

...

const App = () => (
  <Switch history={history} items={routes} />
);
```

## See also

```tsx
import { ConstraintView } from 'react-declarative';
import { DragDropView } from 'react-declarative';
import { ScrollView } from 'react-declarative';
import { ScaleView } from 'react-declarative';
import { FadeView } from 'react-declarative';
import { TabsView } from 'react-declarative';
import { WaitView } from 'react-declarative';
import { PingView } from 'react-declarative';
import { OfflineView } from 'react-declarative';
```

## Patterns inside

1. [MVVM](https://backbonejs.org/#Collection) - `useCollection`
2. [DI](https://angular.io/guide/dependency-injection) - `provide`, `inject`

## License

MIT © [tripolskypetr](https://github.com/tripolskypetr)

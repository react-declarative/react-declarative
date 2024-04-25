# iOS Swipeable Drawer (v2.5.873, 25/04/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.873)
The MUI `<SwipeableDrawer />` is [not working on iOS devices](https://github.com/mui/material-ui/issues/15689).

![image](https://github.com/react-declarative/react-declarative/assets/19227776/c7abcfc0-9db0-4230-85aa-afecd2b5402a)

The `<Scaffold3 />` component is operational on iOS devices, enabling users to employ intuitive swipe gestures with ease.

![mobile](https://github.com/react-declarative/react-declarative/assets/19227776/437b3846-b235-4d2a-b607-91f5b935a596)

# Value Encryption (v2.5.800, 07/04/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.800)
Value read and write transformation support for `<One />` component

```tsx
<One
  ...
  readTransform={(value, name) => {
    if (name.startsWith("api_token_")) {
      return ioc.cryptService.decrypt(value as string);
    }
    return value;
  }}
  writeTransform={(value, name) => {
    if (name.startsWith("api_token_")) {
      return ioc.cryptService.crypt(value as string);
    }
    return value;
  }}
  ...
```

# JSDoc (v2.5.716, 13/03/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.716)
Now [JSDoc](https://jsdoc.app/tags-param) for `<One />` fields and layouts available. Check it in [docs folder](https://github.com/react-declarative/react-declarative/tree/master/docs#field-properties-with-jsdoc)

# Documentation (v2.5.657, 21/02/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.657)
Documentation store in [docs folder](./docs)

# Context Menu Support (v2.5.572, 01/02/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.572)
Context menu for `IField` and `TypedField`

```tsx
const fields: TypedField<any, null>[] = [
  {
    type: FieldType.Text,
    menuItems: [
      {
        label: 'Copy',
        onClick(data) {
          navigator.clipboard.writeText(data.firstName)
        },
      },
      {
        label: 'Paste',
        async onClick(data, payload, onChange) {
          const text = await navigator.clipboard.readText();
          onChange(text)
        },
      }
    ],
    title: 'First name',
    name: 'firstName',
  },
];

...

<One fields={fields} ...
```

# One DictField Support (v2.5.521, 27/01/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.521)
`FieldType.Dict` is usefull when you need to choose `user_id` by using fulltext search

```tsx
{
    type: FieldType.Dict,
    name: "user_id",
    title: "Phone number",
    dictValue: async (user_id) => {
      const data = await ioc.userService.read(user_id);
      return {
        value: data.$id,
        label: data.phone,
        data,
      };
    },
    dictSearch: async ({ search }) => {
      const { rows } = await ioc.userService.findDuplicates(search);
      return rows.map((data) => ({
        value: data.$id,
        label: data.phone,
        data,
      }));
    },
    dictSearchItem: ({ data, disabled }) => (
      <ListItemButton disabled={disabled}>
        <ListItemText primary={data.email} secondary={data.phone} />
      </ListItemButton>
    ),
  },
```

# SearchView Component (v2.5.490, 25/01/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.490)
`<SearchView />` component allow you to choose item from api dictionary or create another record if no exist

![ezgif-3-408ea554e8](https://github.com/react-declarative/react-declarative/assets/19227776/dc6de0ca-5c54-4b03-8bcf-458c8f9a3acf)

# One Spellcheck Support (v2.5.466, 17/01/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.466)
Spellcheck support for `<One />` component. In compassion with `isInvalid` callback the `isIncorrect` callback will not block submit button

# KanbanView Component (v2.5.449, 13/01/2024)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.449)
The `<KanbanView />` allow you to build [kanban](https://en.wikipedia.org/wiki/Kanban_(development)) boards with realtime support

![image](https://github.com/react-declarative/react-declarative/assets/19227776/9f681726-7820-45e8-8b1c-d58e6122ee8f)

# Dynamic Import Dependency Injection (v2.5.346, 21/12/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.346)
Dynamic import while dependency injection helps you to code-split when you got a lot of services

```typescript
import { provide, inject } from 'react';

...

provide(TYPES.appwriteService, async () => {
    const { default: ServiceClass } = await import("./services/base/SomeService");
    return new ServiceClass();
});

...

window.ioc = {
  someService: inject<SomeService>(TYPES.someService),
}

```

# GridView component (v2.5.334, 17/12/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.334)
GridView is a datagrid with virtualization and dynamic row height which support `setState` reordering. Limit-offset and cursor paginators are supported (`useOffsetPaginator`, `useCursorPaginator`)

```tsx
const { data, setData, hasMore, loading, onSkip } =
  useOffsetPaginator<IApartmentRow>({
    handler: async (limit, offset, initial, data) => {
      ioc.loggerService.log("pagination", { initial, limit, offset });
      const rows = await fetchRows({ limit, offset });
      if (initial) {
        const pinRows = await fetchPinRows();
        return [
          ...pinRows
          ...rows.filter(({ id }) => !pinRows.some((row) => row.id === id)),
        ];
      }
      return rows.filter(({ id }) => !data.some((row) => row.id === id));
    },
    reloadSubject,
  });

const { gridProps, commitAction, deselectAll } = useGridAction({
  fetchRow: async (id) => await ioc.apartmentViewService.read(id),
  onAction: async (action: string, rows, deselectAll) => {
      if (action === "pdf-action") {
        await handlePDFPublish(rows);
        deselectAll();
      }
      if (action === "excel-action") {
        await handleDownloadXLSX(rows);
        deselectAll();
      }
  },
  onLoadStart: () => ioc.layoutService.setAppbarLoader(true),
  onLoadEnd:() => ioc.layoutService.setAppbarLoader(false),
  fallback: ioc.errorService.handleGlobalError,
});

...

<GridView
  bufferSize={CC_GRID_BUFFERSIZE}
  data={data}
  hasMore={hasMore}
  loading={loading}
  columns={columns}
  onSkip={onSkip}
  rowActions={rowActions}
  onRowAction={handleRowAction}
  AfterLabel={ShareLabel}
  payload={payload}
  {...gridProps}
/>
```

# One Performance (v2.5.250, 23/11/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.250)
`One` Render Count Minimized

# List Performance (v2.5.170, 02/11/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.170)
List rerender count minimized

# Items field mouse listener (v2.5.110, 11/10/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.110)
`FieldType.Items` now automatically hides the popup after user changed value and moved mouse away.

![ezgif-4-2a3f89184d](https://github.com/react-declarative/react-declarative/assets/19227776/36665809-10ee-4d7d-8cfa-b0cbf94b5e7a)

# ComboBox item list cache (v2.5.102, 04/10/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.102)
Request count minimized

# One Feature Flags (v2.5.45, 17/09/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.45)
Now subset of fields can be statically (fast) hidden by using feature flags

```tsx
<One
  fields={apartment_fields}
  handler={() => data}
  onChange={onChange}
  features={[
    "hasPhoneNumberPermission"
  ]}
/>
```

Phone number will be visible only if `hasPhoneNumberPermission` feature flag is provided

```tsx
{
  type: FieldType.Text,
  name: 'phone',
  title: 'Phone number',
  features: [
    'hasPhoneNumberPermission',
  ],
```

# Value Apply Schedule (v2.5.34, 16/09/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.5.34)

# Field Validation (v2.4.107, 01/09/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.4.107)
Better field validation support with `isInvalid` callback. Now support cross field value binding

# Auto Baseline (v2.4.63, 24/08/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.4.63)
Automatic upper baseline for outlined fields and lower baseline for standard fields

# List Column isVisible (v2.4.58, 23/08/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.4.58)

# OutletView (v2.4.42, 20/08/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.4.42)
Inspired by [react-router-dom](https://medium.com/age-of-awareness/amazing-new-stuff-in-react-router-v6-895ba3fab6af)

# Lower Memory Consumption (v2.4.19, 18/08/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.4.19)
Minimize useState execution

# Memoization (v2.4.2, 15/08/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.4.2)
Render count decreased 3 times

# Service pack (v2.2.359, 13/07/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.359)
Better `useArrayPaginator`, `<List />` search input patch, `isInvalid` callback patch, `useQueryPagination` patch

# SearchModal (v2.2.261, 21/06/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.261)
The `useSearchModal` hook will help you pick User id from paginated CRUD endpoint

![image](https://github.com/react-declarative/react-declarative/assets/19227776/15f00a6b-2eef-4441-9748-8010f3d47019)

# FilesView (v2.2.223, 11/06/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.223)
`<FilesView />` will help you manage multiple files upload and storage

![image](https://github.com/react-declarative/react-declarative/assets/19227776/1b692d79-4067-444f-a084-8a96820741f0)

# Service Pack (v2.2.218, 10/06/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.218)
`usePreventLeave` loadstart/loadend callbacks

# Document Preview Components (v2.2.214, 09/06/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.214)
Now you can use `<ImageView />` for image preview and `<DocumentView />` for PDF preview

![image](https://github.com/react-declarative/react-declarative/assets/19227776/a92d4ac6-99a5-4d34-b559-38227f548333)

# File Field (v2.2.212, 06/06/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.212)
File picker suitable for [FireStore](https://firebase.google.com/docs/storage/web/upload-files), [S3](https://min.io/) or similar cloud storage

```tsx
{
  type: FieldType.File,
  title: 'Document',
  description: 'Select document',
  name: 'file',
},
```

# I18n (v2.2.203, 20/05/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.203)
`Translate` JSX runtime will be quite useful for internationalization

# Breadcrumbs2 Component (v2.2.198, 30/04/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.198)
```tsx

const actions: IBreadcrumbs2Action[] = [
  {
    label: 'Sample action',
    action: 'sample-action',
  }
];

const items: IBreadcrumbs2Option<IOneData>[] = [
  {
    type: Breadcrumbs2Type.Link,
    label: 'title',
    action: 'title-action',
  },
  {
    type: Breadcrumbs2Type.Link,
    label: 'subtitle',
    action: 'subtitle-action',
  },
  {
    type: Breadcrumbs2Type.Button,
    isDisabled: (data) => data === null,
    label: 'Save',
    action: 'button-action',
  },
];

...

<Breadcrumbs2<IOneData>
  payload={data}
  actions={actions}
  items={items} 
  onAction={onAction}
/>
```

# Machine Learning Tools (v2.2.184, 17/04/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.184)
If you ever worked with [OpenCV DNN](https://learnopencv.com/deep-learning-with-opencvs-dnn-module-a-definitive-guide/) you must known that every neural network requires a huge dataset of labeled targets. There is no any exception for non-graphical neural networks too, we still need to mine the data.

![how-chatgpt-actually-works](https://user-images.githubusercontent.com/19227776/232486183-027df52c-6be2-4669-a6cf-5674180fce9e.png)

But if for media materials It easy enough to google required images, for dynamic data we have to do this in runtime. It possible to pretrain neural network on static CSV files, but there is a high possibility what the prediction results will be outdated before first execution.

![cerebellum](https://user-images.githubusercontent.com/19227776/232487761-efab18c3-e807-4724-be8a-be5c21ea7007.png)

So we need to build a linear architecture which will act like a cerebellum. It should make preparation of data, execute side effects and provide a slot to connect neocortex, the neural network. So that's the thing, who are going to label the recognition result if the neural network exist only in runtime. Gladly, we can capture data mutation history and simulate the work of neural network in past without giving it latest values.

![image](https://user-images.githubusercontent.com/19227776/232490060-771b93f4-e27c-44db-aa61-0416876617aa.png)

To do that we need to use [Alan Kay's interpretation of OOP](https://softwareengineering.stackexchange.com/questions/46592/so-what-did-alan-kay-really-mean-by-the-term-object-oriented). In our time It implemented as [the observable design pattern](https://en.wikipedia.org/wiki/Observer_pattern)

![stride-tricks](https://user-images.githubusercontent.com/19227776/232495997-9e79f840-60fe-44d3-90b2-d9908f6dd420.gif)

To get trainment data from incoming tensor we can use [stride tricks](https://developers.google.com/machine-learning/practica/image-classification/convolutional-neural-networks) algorithm which crops a huge blob of data to multiple chunks which we can feedforward. In the next case, I am calling them "tokens".

```tsx
const { Source, Operator } = require('react-declarative')

const SEQUENCE_TO_PREDICT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, /* 13 */];
const TOKEN_LENGTH = 4;

Source.fromValue(SEQUENCE_TO_PREDICT)
  .operator(Operator.strideTricks(TOKEN_LENGTH))
  .connect(console.log)
```

After execution of this code we will get this console output

```json
[
  [ 1, 2, 3, 4 ],
  [ 3, 4, 5, 6 ],
  [ 5, 6, 7, 8 ],
  [ 7, 8, 9, 10 ],
  [ 9, 10, 11, 12 ]
]
```
We can take the first value of this pipe and use It as a dataset for training [BrainJS](https://brain.js.org/) or [TensorflowJS](https://www.tensorflow.org/js). The last value of each sequence must be a prediction result, If it's not correct we need to adjust neuron weights (`1, 2, 3 -> 4`, `3, 4, 5 -> 6`, `5, 6, 7 -> 8`)

```tsx
.operator(Operator.take(1))
.mapAsync(async (data) => await asyncNet.trainAsync(data))
```

If you read up to this line, It might be useful to check the [brainjs-cryptocurrency-trend](https://github.com/react-declarative/brainjs-cryptocurrency-trend) too)

# Reactive snippets (v2.2.161, 12/04/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.161)
Added several snippets for reactive code. For example, [check this project](https://github.com/react-declarative/react-face-kyc/blob/d3cd0689630a839cd3b0d07e68f64db24c95b91e/src/hooks/useFaceWasm/emitters.ts#L73)

# Better State Tools (v2.2.138, 02/04/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.138)
The best state tools for [feature oriented development](https://github.com/react-declarative/react-declarative/blob/7d195202f4e015d5a7283d571c9c5c5c5378726a/NOTES.md#using-underected-data-flow-for-building-software-product-line)

```tsx
const [text, setText] = useState("");

const textChanged = useChangeSubject(text);

useSubscription(textChanged.debounce(), () => {
    // Easy money
});
```

# Scaffold2 Component (v2.2.76, 27/02/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.76)
The `<Scaffold2 />` implements the basic Material Design visual layout structure by using config instead of manual ui elements composition

```tsx
const options: IScaffold2Group[] = [
  {
    id: 'build',
    label: 'Build',
    children: [
      {
        id: 'authentication',
        label: 'Authentication',
        isVisible: async () => await ioc.authService.hasRole('unauthorized'),
        icon: PeopleIcon,
        tabs: [
          { id: 'tab1', label: 'Tab1 in header', },
          { id: 'tab2', label: 'Tab2 in header', },
        ],
        options: [
          { id: 'tab1', label: 'Tab1 in side menu' },
          { id: 'tab2', label: 'Tab2 in side menu' },
        ],
      },
      { id: 'Database', label: 'Label is optional (can be generated automatically from ID in snake case)', icon: DnsRoundedIcon, },
      { id: 'Storage', isDisabled: async () => await myAmazingGuard(), icon: PermMediaOutlinedIcon, },
      { id: 'Hosting', icon: PublicIcon, },

      ...
```

# Starter kits (v2.2.6, 02/01/2023)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.2.6)
Now several starter kits available

**1. Solidity Starter**

> GitHub repo: [https://github.com/react-declarative/cra-template-solidity](https://github.com/react-declarative/cra-template-solidity)

```bash
yarn create react-app --template cra-template-solidity .
```

**2. AppWrite Starter**

> GitHub repo: [https://github.com/react-declarative/cra-template-appwrite](https://github.com/react-declarative/cra-template-appwrite)

```bash
yarn create react-app --template cra-template-appwrite .
```

**3. Vanilla Starter**

> GitHub repo: [https://github.com/react-declarative/cra-template-react-declarative](https://github.com/react-declarative/cra-template-react-declarative)

```bash
yarn create react-app --template cra-template-react-declarative .
```

# One Payload (v2.1.86, 14/12/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.1.86)
The `payload` prop for `One` component

# Patterns inside (v2.1.37, 21/11/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.1.37)
## Patterns inside

Now contains snippets for several software design patterns which will simplify your app development

1. [MVVM](https://backbonejs.org/#Collection) - `useCollection`
2. [DI](https://angular.io/guide/dependency-injection) - `provide`, `inject`
3. [Observer](https://en.wikipedia.org/wiki/Observer_pattern) - `useChangeSubject`
4. [Command](https://en.wikipedia.org/wiki/Command_pattern) - `ActionTrigger`, `ActionFilter`, `ActionButton`, `ActionToggle`, `ActionMenu`, `ActionIcon`
5. [Coroutine](https://en.wikipedia.org/wiki/Coroutine) - `FetchView`, `WaitView`, `PingView`, `Async`, `If`
6. [Monad](https://en.wikipedia.org/wiki/Monad_(functional_programming)) - `singleshot`, `cancelable`, `queued`, `cached`, `debounce`, `compose`

# React 18.2 MUI 5 Support (v2.1.7, 09/10/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.1.7)
MUI upgrade + react bump

# AutoSizer patch (v2.0.66, 08/10/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.0.66)
AutoSizer now requires less render cycles

# Better Scaffold Groups (v2.0.42, 16/09/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.0.42)
`Scaffold` groups now can be collapsed and lifted. Added autolift while searching

![image](https://user-images.githubusercontent.com/19227776/190634908-75eadded-cd99-43e3-8f38-976727ed36d7.png)

# ActionState Components (v2.0.41, 15/09/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.0.41)
`ActionButton`, `ActionFilter`, `ActionIcon`, `ActionMenu`, `ActionTrigger` will provide easiest api for user action triggering

# MVVM State Manager (v2.0.19, 11/09/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/2.0.19)
The `useCollection` and `useEntity` hooks will notify UI on some object property changed

```tsx
import { useCollection } from "react-declarative";

const ListItem = ({ entity }) => {
  const handleIncrement = () => {
    /*
    await fetch(`/api/v1/counters/${entity.id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        counter: entity.data.counter + 1
      })
    });
    */
    entity.setData({
      id: entity.id,
      counter: entity.data.counter + 1
    });
  };

  return (
    <div key={entity.id}>
      {entity.data.counter}
      <button onClick={handleIncrement}>Increment counter</button>
    </div>
  );
};

export const App = () => {
  const collection = useCollection({
    onChange: (collection, target) =>
      console.log({
        collection,
        target
      }),
    initialValue: [] // await fetch()...
  });

  const handleAdd = () => {
    /*
    const { id, ...data } = await fetch("/api/v1/counters/create", {
      method: "POST",
    }).then((data) => data.json());
    */
    collection.push({
      id: Math.max(...collection.ids, 0) + 1,
      counter: 0
      // ...data
    });
  };

  return (
    <>
      {collection.map((entity) => (
        <ListItem key={entity.id} entity={entity} />
      ))}
      <button onClick={handleAdd}>Add item</button>
    </>
  );
};

export default App;

```

# FetchView Upgrade (v1.9.154, 02/09/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.154)
Better type definition for `FetchView` component

```tsx
import { FetchView } from 'react-declarative';

const state = () => [
  sleep(1_000).then(() => 'string'),
  sleep(3_000).then(() => 1),
  sleep(2_000).then(() => false),
  // Promise.reject('error'),
] as const;

return (
  <FetchView state={state}>
    {(str, num, bool) => (
      <span>
        {JSON.stringify({
          str,  // @type string
          num,  // @type number
          bool, // @type boolean
        }, null, 2)}
      </span>
    )}
  </FetchView>
);
```

# CRA Template (v1.9.140, 23/08/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.140)
Now there is a `create-react-app` template available. You can use It by executing

```bash
npx create-react-app . --template=react-declarative
```

Source code is published [in this repo](https://github.com/react-declarative/cra-template-react-declarative)

# One Validation Upgrade (v1.9.119, 17/08/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.119)
Better `One` component field data validation

# ScaleView Component (v1.9.112, 11/08/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.112)
`ScaleView` will automatically downscale any html layout into tiny parent container. Check [this codesandbox](https://codesandbox.io/s/react-declarative-scaleview-xq7i6c?file=/src/App.js)

![screenshot](https://user-images.githubusercontent.com/19227776/184148129-1927506c-44ca-44f0-a64c-6010cb8f5821.gif)

```tsx
import { useRef, useEffect } from "react";

import { ScaleView } from "react-declarative";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    const ctx = canvas.getContext("2d");

    const myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            label: "My First Dataset",
            data: [300, 50, 100],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)"
            ],
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false
      }
    });

    return () => myChart.destroy();
  }, [canvasRef]);

  return (
    <ScaleView
      center
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <canvas ref={canvasRef} width="500" height="600" />
    </ScaleView>
  );
};

export default App;
```

# Scaffold Upgrade (v1.9.103, 27/07/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.103)
Async callbacks for [Scaffold](https://api.flutter.dev/flutter/material/Scaffold-class.html)

```tsx
const options: IMenuGroup[] = [
  {
    label: 'Use cases',
    options: [
      {
        name: "layout-page",
        label: 'Layout grid',
        isVisible: async () => {
          await sleep(5_000);
          return false;
        },
      },
```

# TabsView useTabsHashstate (v1.9.100, 26/07/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.100)
Better [history](https://npmjs.com/package/history) experience

```tsx
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

...

const { tabsProps } = useTabsHashstate({
  history,
});
  
...

<TabsView
  items={tabs}
  {...tabsProps}
>
  {(value) => {
      if (value === 'tab1') {
        return <Tab1 />
      } else if (value === 'tab2') {
        return <Tab2 />
      } else {
        return <NothingAvailable />
      }
  }}
</TabsView>
```

# Tabs View (v1.9.88, 23/07/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.88)
Declarative material tabs with easiest [Role Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control) integration as you can imagine

```tsx
import { TabsView, ITab } from 'react-declarative';

...

const tabs: ITab[] = [
    {
        label: 'tab1',
        value: 'tab1',
        isDisabled: async () => {
            await sleep(3_000);
            return true;
        }
    },
    {
        label: 'tab2',
        value: 'tab2',
    },
];

...

return (
  <TabsView items={tabs}>
    {(value) => {
      if (value === 'tab1') {
        return <Tab1 />
      } else if (value === 'tab2') {
        return <Tab2 />
      } else {
        return <NothingAvailable />
      }
    }}
  </TabsView>
)

```

# List Query Passthrough (v1.9.85, 20/07/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.85)
The easiest way to restore List query from url by parsing

```tsx
const pagination = useParsedPagination(window.location.hash);
return (
  <List
    {...pagination}
  />
```

and serializing pagination into link hashstate

```tsx
const { listProps, serializedPagination } = useSerializedPagination();
useEffect(() => {
  window.location.hash = serializedPagination;
}, [serializedPagination])
return (
  <List
    {...listProps}
  />
  ```

# List Fab Labels (v1.9.77, 10/07/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.77)
Labels for buttons in top right corner of `List` component

![image](https://user-images.githubusercontent.com/19227776/178147330-6ce55ff1-7f98-452f-aefb-6ad5e4f5d792.png)

# List Column Actions (v1.9.71, 07/07/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.71)
Action menu for column in `List` component

![image](https://user-images.githubusercontent.com/19227776/177830549-4a69ab1a-9c1d-4b96-8a13-670dbc25fdb3.png)

# List Pagination Upgrade (v1.9.64, 03/07/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.64)
Better list pagination with `debounce` execution

![image](https://user-images.githubusercontent.com/19227776/177042419-273933c1-95c3-40a2-8871-20038db75d6e.png)

# List Search Bar (v1.9.56, 01/07/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.56)
List Component keyword searching support

![Screenshot from 2022-07-01 18-22-49](https://user-images.githubusercontent.com/19227776/176923556-dce35b87-da14-4ee0-b67a-9b4b03c8921d.png)

# List Paginators Preset (v1.9.54, 30/06/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.54)
Few more hooks for List Component

`useApiPaginator`, `useArrayPaginator`, `useCachedPaginator`, `useLastPagination`

# List Selection Refactor (v1.9.43, 27/06/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.43)
Better availability callbacks for `List` fab actions, row actions, operations.

```tsx
const actions: IListAction[] = [
  {
    type: ActionType.Menu,
    options: [
      {
        action: 'export-action',
        label: 'Export to xlsx',
        isDisabled: (rows) => {
          return !rows.some(({ excelExport }) => excelExport)
        },
      },
```

# List Operations Row (v1.9.39, 23/06/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.39)
List operations is an actions which can be triggered for set of rows

![image](https://user-images.githubusercontent.com/19227776/175354847-dd2cbd04-73f4-45c1-b4fd-a9a6bbf112c6.png)

# ActionMenu Component (v1.9.31, 18/06/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.31)
`ActionMenu` component will provide right-click like menu. It equipped with `isVisible`, `isDisabled` callbacks which can await promise for decision about hiding or disabling items. This component used in `List` to provide context menu for row and [FAB](https://mui.com/material-ui/api/fab/#main-content) (check top right corner on list page in demo app)

```
const actions: IListAction[] = [
  {
    action: 'only-admin-allowed',
    isDisabled: () => ioc.roleModelService.hasRoles('admin'),
    label: 'Only admin action',
  },
```

# Developer Experience (v1.9.25, 15/06/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.25)
[Async](https://github.com/react-declarative/react-declarative/tree/7750b3387573e5414f99af926e0966545e6fec16/src/components/Async) component upgrade, better [pagination hooks](https://github.com/react-declarative/react-declarative/blob/7750b3387573e5414f99af926e0966545e6fec16/src/index.ts#L118), circular dependency prevention [DI container](https://github.com/react-declarative/react-declarative/blob/7750b3387573e5414f99af926e0966545e6fec16/src/helpers/serviceManager.ts#L16) upgrade, [List selection](https://github.com/react-declarative/react-declarative/blob/7750b3387573e5414f99af926e0966545e6fec16/src/components/List/components/SlotFactory/components/HeadRow/components/DesktopHeadRow.tsx#L59) upgrade

# Switch Transition Animation (v1.9.6, 01/06/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.9.6)
`Switch` transition animation, `prefetch` api

# Production Tested (v1.8.99, 24/05/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.99)
This one has been used on production of commercial solution. Waiting for your move

# Page Unload Blocker (v1.8.91, 15/05/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.91)
The `usePreventLeave` hook will block any attempt to leave One-templated page with unsaved changes

![image](https://user-images.githubusercontent.com/19227776/168446581-ebb2e636-d4af-456a-82c6-8af3168c97f9.png)

# List Adaptive Layout Engine (v1.8.79, 08/05/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.79)
Automatic transition to the mobile list view when the screen width is limited

![2022-05-07 23 39 10](https://user-images.githubusercontent.com/19227776/167271057-437dd099-f459-4835-9a38-3ce67412bdbf.jpg)

# List Slot Factory (v1.8.72, 05/05/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.72)
An easiest way to override mobile datagrid layout

# List Breakpoint Constraints (v1.8.67, 03/05/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.67)
Separated list width for `phone`, `tablet` and `desktop` screens

```
const columns: IColumn[] = [
  {
    type: ColumnType.Text,
    field: 'name',
    headerName: 'First Name',
    phoneWidth: (fullWidth) => fullWidth / 2,
    tabletWidth: (fullWidth) => fullWidth / 5,
    desktopWidth: (fullWidth) => fullWidth / 7,
    ...
```

# List Chips Support (v1.8.48, 27/04/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.48)
Material-chip based boolean filter for list component

![image](https://user-images.githubusercontent.com/19227776/165587214-f0b41595-5c70-443e-bcd4-f4e90a964b54.png)

# AbortController Support (v1.8.42, 25/04/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.42)
The `useApiPaginator` and`useApiHandler` hooks are now providing `AbortController` support. By them you can easely write higer order functions to integrate custom REST Api without any pain

# List Default Paginators (v1.8.41, 23/04/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.41)
Preinstalled `useApiPaginator` and `useStaticPaginator` hooks will help you easily create mock or api pagination handlers with sorting and filtering support

```tsx
import { List, useStaticPaginator }  from 'react-declarative';

const mock = [
  {
    id: 1,
    foo: 'bar',
  } ,
    {
    id: 2,
    foo: 'baz',
  } 
];

const Page = () => {
  const handler = useStaticPaginator(mock);
  return (
    <List
      handler={handler}
      ...

```

# Input Formatter (v1.8.35, 12/04/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.35)
Input formatter for text fields

```tsx
{
  type: FieldType.Text,
  title: 'Phone number',
  name: 'phone',
  inputFormatterTemplate: '+1 (000) 000-0000',
}
```

# Dependency Cleanup (v1.8.34, 11/04/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.34)
`react-modal-hook` rewritten internally due to incompatible `react@^16.8.3` dependency

# Service Pack (v1.8.29, 06/04/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.29)
A few minor upgrades which provide better developer usability

# Multiple FadeView Direction (v1.8.19, 27/03/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.19)
Vertical fade container now available

![image](https://user-images.githubusercontent.com/19227776/160285370-bc308736-f8ec-49a3-b7ba-f16fdae905b4.png)

# List Picker (v1.8.18, 26/03/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.18)
Lightweight modal list item picker

![image](https://user-images.githubusercontent.com/19227776/160191168-07a1b0c1-e88b-4b0b-b061-e26caed8d15d.png)

# List Selection Refactor (v1.8.17, 25/03/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.17)
List Selection Api rows state synchronization

# List Overflow Protection (v1.8.13, 24/03/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.13)
Broken pagination detector will prevent DOM render stuck

![telegram-cloud-photo-size-2-5323670667461246678-x](https://user-images.githubusercontent.com/19227776/159967146-185f523f-d22e-4e01-a0dc-27f3b2cd1b55.jpg)

# Group custom number of columns (v1.8.11, 19/03/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.11)
Now you can build a dashboard that requires more granular layout positioning.

```tsx
{
  type: FieldType.Group,
  columnsOverride: '5', // <--
  fieldRightMargin: '0',
  fields: [...new Array(5)].map((_, idx) => ({
    type: FieldType.Paper,
    fieldRightMargin: idx === 4 ? '0' : '1',
    columns: '1',
    style: {
      minHeight: 125,
    }
  })),
},

...
```

![image](https://user-images.githubusercontent.com/19227776/159119662-2767b6de-8969-4f79-aca0-f78d65ed94b8.png)

# Switch better user experience (v1.8.6, 17/03/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.6)
Switch guard loader appear delay

# Mobile List Selection Api (v1.8.5, 13/03/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.5)
Mobile List Component single and multiple row selections

![image](https://user-images.githubusercontent.com/19227776/158066634-cf26d84b-9bf5-4b93-b791-178d37f27f3a.png)

# New List Engine (v1.8.0, 12/03/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.8.0)
`@mui/x-data-grid` deprecated for performance reasons

# One Callback Alias (v1.7.15, 27/02/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.7.15)
Alias for callback props to keep naming convention

```tsx
export interface IOnePublicProps<Data = IAnything, Field = IField<Data>>
    extends IOneProps<Data, Field> {
    onFocus?: IOneProps<Data, Field>['focus'];
    onBlur?: IOneProps<Data, Field>['blur'];
    onReady?: IOneProps<Data, Field>['ready'];
    onChange?: IOneProps<Data, Field>['change'];
    onInvalid?: IOneProps<Data, Field>['invalidity'];
};
```

# BottomFade Component (v1.7.10, 23/02/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.7.10)
BottomFade will fade out the bottom of scrollable content

![image](https://user-images.githubusercontent.com/19227776/155226303-ce2a8009-a003-443e-b8be-8a895fe8badd.png)

# Center Layout keep-flow mode (v1.7.6, 22/02/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.7.6)
Center layout will keep document flow by default
![image](https://user-images.githubusercontent.com/19227776/155173732-9ccb63a0-7d02-4b25-af0a-831fb0ea024f.png)

# Tabs Layout (v1.7.2, 21/02/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.7.2)
Tabs layout for One component

![image](https://user-images.githubusercontent.com/19227776/154868073-7c1d891a-be8d-4648-88d8-98e0663f1054.png)

# ESBuild Migration (v1.7.0, 20/02/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.7.0)
Bundle size reduced to `282kb`

![image](https://user-images.githubusercontent.com/19227776/154845292-348a40cc-8d23-4634-99a0-ab421317cb3d.png)

# One Roles API (v1.6.14, 17/02/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.6.14)
[Role model design pattern](https://en.wikipedia.org/wiki/Role_Class_Model) for `fields` and `layouts`

```tsx
const fields: TypedField[] = [
    {
        type: FieldType.Paper,
        roles: [
            "admin"
        ],
        child: {
            type: FieldType.Typography,
            typoVariant: 'body1',
            placeholder: 'Not allowed',
        },
    },
    {
        type: FieldType.Typography,
        roles: [
            "admin"
        ],
        typoVariant: 'h2',
        placeholder: 'Another hidden field',
    },
];

...

export const SomePage = () => (
    <OneTyped roles={["user"]} ...
```

# Advanced List Sizing (v1.6.9, 23/01/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.6.9)
List Component filter collapse now shrinks it height

![image](https://user-images.githubusercontent.com/19227776/150657335-5bdfa5a6-6efd-4f3c-ad5e-5af84980d6dd.png)

# MUI Upgrade (v1.6.0, 06/01/2022)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.6.0)
Migration from `v4` to `v5` version of [material-ui](https://mui.com/)

![image](https://user-images.githubusercontent.com/19227776/148305891-37551920-e1a4-4c4f-aa70-91e29469e7b7.png)

# Mobile List Renderer (v1.5.90, 28/12/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.90)
An alternative List Component engine allows you to adapt your CRM system for mobile users

![image](https://user-images.githubusercontent.com/19227776/147579338-b42e9e9b-6102-4d17-857a-cccf0531b05a.png)

# Outline Layout (v1.5.87, 11/12/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.87)
Modern-look flat material card implementation

```tsx
const fields: TypedField[] = [
    {
        type: FieldType.Outline,
        fieldBottomMargin: '1',
        fields: [
            {
                type: FieldType.Line,
                title: 'Checkboxes',
            },
```
![image](https://user-images.githubusercontent.com/19227776/145673783-0b810fcb-257f-4875-9f27-80550fbba515.png)

# Translate JSX Factory (v1.5.84, 08/12/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.84)
The simplest tool for localization ever

> `tsconfig.json`

```tsx
{
  "compilerOptions": {
    "jsx":"react",
    "jsxFactory":"Translate.createElement",
  }
}
```

> `index.ts`

```
...
registerTr({
  'Home page': 'Домашняя страница'
});
...
```

# List Additional Columns (v1.5.82, 05/12/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.82)
The Compute and Component columns for List

```tsx
{
  type: ColumnType.Compute,
  headerName: 'Full name',
  compute: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  width: '200px',
},
{
  type: ColumnType.Component,
  headerName: 'Component',
  element: () => (
    <div>
      Custom cell Component
    </div>
  ),
  width: '200px',
},
```

![image](https://user-images.githubusercontent.com/19227776/144725489-c7a74fb4-d04a-4e35-bbfd-ec1290ebf899.png)

# List Component Autoreload (v1.5.73, 01/12/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.73)
The auto reload feature of the List Components will keep the data inside the datagrid always updated (ajax auto refresh)

![image](https://user-images.githubusercontent.com/19227776/144229649-74434324-4f89-4786-929e-fc57c8d6eb45.png)

```tsx
const actions: IListAction[] = [
  {
    type: ActionType.Add,
  },
  {
    type: ActionType.Menu,
    options: [
      {
        action: 'add-action',
        label: 'Create new row',
        icon: Add,
      },
      {
        action: 'update-now',
      },
      {
        action: 'auto-reload',
      },
    ],
  }
];
```

# Minor changes (v1.5.71, 29/11/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.71)
Additional props, several new fields

# CenterLayout Field (v1.5.44, 16/11/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.44)
A layout which centers the responsive grid by reducing empty cells width and enables scroll when there is a lack on free space

# Async List Pickers (v1.5.26, 08/10/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.26)
The most advanced item pickers)

```tsx
{
    type: FieldType.Combo,
    name: 'gender',
    title: 'Gender',
    description: 'Your gender',
    async itemList() {
        await sleep(1e3);
        return [
            'male-unique-key',
            'female-unique-key',
            'other-unique-key',
        ];
    },
    async tr(current) {
        await sleep(5e2);
        if (current === 'male-unique-key') {
            return 'Male';
        } else if (current === 'female-unique-key') {
            return 'Female';
        } else if (current === 'other-unique-key') {
            return 'Other';
        } else {
            return "";
        }
    },
    defaultValue: 'male-unique-key',
},
{
    type: FieldType.Items,
    name: 'lists',
    title: 'User lists',
    description: 'Multiple input',
    async itemList() {
        await sleep(1e3);
        return [
            'vip-value',
            'allow-value',
            'other-value',
        ];
    },
    async tr(current) {
        await sleep(5e2);
        if (current === 'vip-value') {
            return 'Vip';
        } else if (current === 'allow-value') {
            return 'Allow';
        } else if (current === 'other-value') {
            return 'Other';
        } else {
            return "";
        }
    },
    defaultValue: ['vip-value', 'allow-value'],
}
```

![ezgif-2-90fe6416bafe](https://user-images.githubusercontent.com/19227776/136573875-8e6adebb-bc34-48e7-b3b5-4a12fcb1c661.gif)

# List Row Color (v1.5.25, 03/10/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.25)
Colored indication on List Component rows will help you briefly classify inner information based on importance

# Switch Component Features (v1.5.19, 09/09/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.19)
Switch Component redirect, bug fixes

# Switch Component (v1.5.17, 06/09/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.17)
Minimal router based on [history](https://www.npmjs.com/package/history)

# Breadcrumbs Component (v1.5.15, 31/08/2021)
> Github [release link](https://github.com/react-declarative/react-declarative/releases/tag/1.5.15)
The most advanced component for the list item form

# Small patches (v1.6, 04/01/2021)
> Github [release link](https://github.com/tripolskypetr/material-ui-umd/releases/tag/1.6)
Group columns priority, input debounce value flush after lost focus, new samples

[https://theonekit.com](https://theonekit.com)

# Validity callback (v1.5, 01/01/2021)
> Github [release link](https://github.com/tripolskypetr/material-ui-umd/releases/tag/1.5)
You can now easily control whether the form save button is disabled using `validity` and `change` callbacks

[https://theonekit.com](https://theonekit.com)

# Strict typed JSON (v1.4, 25/12/2020)
> Github [release link](https://github.com/tripolskypetr/material-ui-umd/releases/tag/1.4)
Try OneTyped component. Site with [demos](https://theonekit.com) by the link

# Upgrades (v1.3, 23/12/2020)
> Github [release link](https://github.com/tripolskypetr/material-ui-umd/releases/tag/1.3)
Few new modal dialog pickers, insignificant changes. See the [demo](https://theonekit.com) by the link

# Ready to use (v1.2, 28/11/2020)
> Github [release link](https://github.com/tripolskypetr/material-ui-umd/releases/tag/1.2)
It looks like this toolkit has become as mach stable as required to make student projects. See the [demo](https://theonekit.github.io/) by the link

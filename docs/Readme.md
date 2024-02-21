# One Component

> `<One />` is a component of the `react-declarative` library, representing a form with various fields (text, images, rating, etc.) and a grid layout. This layout allows for convenient storage, creation, and modification of data, such as a user's profile.

## Articles:

1. [React components for undirected data flow](./other/react-components-for-data-flow.md)
2. [MobX onion architecture](./other/onion-architecture-mobx.md)

## Source Description:

1. [OneInternal](./code/OneInternal.md)
2. [OneGenesis](./code/OneGenesis.md)
3. [One](./code/One.md)
4. [IManaged](./code/IManaged.md)
5. [makeField](./code/makeField.md)
6. [TypedField](./code/TypedField.md)

## Overview

The goal is to create a unified React component for settings-like forms. The component manages form state, handles validation, and streamlines the development process by reducing boilerplate code.

## Key Features 

1. **Field Configuration** : Fields are configured using an array of objects implementing the `IField` interface, defining the field type, structure, and other properties.

> Link to [the demo](https://jsfiddle.net/tripolskypetr/0pywxmsk/)

```tsx
<One
  fields={[
    {
      type: FieldType.Items,
      title: 'A sample field',
      placeholder: 'Multiple selection',
      name: 'items',
      itemList: ['a', 'b', 'c'],
      isVisible: (obj) => obj.visible,
      isDisabled: (obj) => obj.disabled,
    },
    {
      type: FieldType.Checkbox,
      title: 'Mark as visible',
      defaultValue: true,
      name: 'visible',
    },
    {
      type: FieldType.Checkbox,
      title: 'Mark as disabled',
      defaultValue: false,
      name: 'disabled',
    },
  ]}
/>
```

 
2. **Automatic State Management** : The component automatically manages form state based on three criteria - field name, a handler function for fetching data, and an `onChange` callback.

> Link to [the demo](https://jsfiddle.net/tripolskypetr/erw7gcxq/)

```tsx
const handler = () => Promise.resolve({ key: 'value' }) // or simply handler = { key: 'value' }
<One
  fields={[
    {
      type: FieldType.Checkbox,
      title: 'Tomato',
      defaultValue: true,
      name: 'isTomatoChecked',
    },
    {
      type: FieldType.Checkbox,
      title: 'Cheese',
      name: 'isCheeseChecked',
    },
  ]}
  handler={handler}
  fallback={fallback}
  onChange={change}
  LoadPlaceholder={SpinerComponent}
/>
```

3. **Responsive Layout** : The component supports a responsive layout with columns specified for different screen sizes.

> Link to [the demo](https://jsfiddle.net/tripolskypetr/w3mr4akv/)

```tsx
<One fields={[
  {
    type: FieldType.Group,
    phoneColumns: '12',
    columns: '6',
    fields: [
      //...
    ],
  },
  {
    type: FieldType.Group,
    phoneColumns: '12',
    columns: '6',
    fields: [
      //...
    ],
  },
]} />
```

4. **Field Customization** : Fields can be customized with options such as visibility, disabled state, and invalidity.

> Link to [the demo](https://jsfiddle.net/tripolskypetr/0pywxmsk/)

```tsx
<One
  fields={[
    {
      type: FieldType.Items,
      title: 'A sample field',
      placeholder: 'Multiple selection',
      name: 'items',
      itemList: ['a', 'b', 'c'],
      isVisible: (obj) => obj.visible,
      isDisabled: (obj) => obj.disabled,
    },
    //...
  ]}
/>
```

5. **Additional Features** : The component supports computed fields, event handling for icons, and options for disabling the "Save" button based on form validation.

> Link to [the demo](https://jsfiddle.net/tripolskypetr/67m3aoc1/)

```tsx
<One
  fields={[
    {
      type: FieldType.Progress,
      showPercentLabel: true,
      name: 'slider',
    },
    {
      type: FieldType.Slider,
      name: 'slider',
      leadingIcon: VolumeDown,
      trailingIcon: VolumeUp,
      defaultValue: 30,
      leadingIconClick(v, change) { change(v - 10) },
      trailingIconClick(v, change) { change(v + 10) },
    },
    //...
  ]}
/>
```

## Benefits 
- **Code Reusability** : Reduces duplication by creating a unified component for form handling. 

- **Simplified Configuration** : Abstracts away complex form configurations into a simple and customizable interface. 

- **Responsive Design** : Easily adapts to different screen sizes with responsive layout options. 

- **Improved Developer Experience** : Streamlines development with automatic state management and customizable field behaviors.

This One form component aims to enhance code maintainability, readability, and efficiency in developing settings-like forms.

## Usage

There are four main props which you need to pay attention to.

### 1. fields

This is the primary aspect to work with. Here, you list the fields that should be in the form. It is defined through the `fields` variable (an array) with the type `TypedField[]`.

```tsx
const fields: TypedField[] = [
{
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Rating,
        columns: "2",
        phoneColumns: '12',
        fieldBottomMargin: "0",
        name: "rating",
        defaultValue: 3
      },
      {
        type: FieldType.Group,
        columns: "10",
        phoneColumns: '12',
        fields: [
          {
            name: 'lastName',
            type: FieldType.Text,
            title: 'Last name',
            description: 'Required',
          },
          {
            type: FieldType.Combo,
            title: "Gender",
            placeholder: "Choose your gender",
            name: "gender",
            itemList: [
              "Male",
              "Female",
            ]
          },
        ]
      }   
    ]  
}] 

export const examplePage = () => (
  <One
    fields={fields}
  /> 
);
```

The main props include:

`type` - specifies the field type, for example, `type: FieldType.Group`. There are a total of 22 field types.

`columns` - used for layout, with a string value from 1 to 12, where 12 represents the full width (following grid logic).

`desktopColumns`, `tabletColumns`, and `phoneColumns` - used to configure the layout on desktop, tablet, and smartphone, respectively.

Each field type has its own properties such as `name`, `title`, `fieldBottomMargin`, `outlined`, `defaultValue`, etc.

To insert a separate component into `fields`, use `type: FieldType.Component`, where the desired component is specified in the `element` property. For example:

```tsx
{
    type: FieldType.Component,
    element: () => (
        <div> Example </div>
    ),
}
```

### 2. handler

It should be a function (can return a promise) or a reference to the component's state. It is used to connect the component to the server or mock data. Through variable context composition, you can reach the `id` from the route.

### 3. fallback

A callback in case of an error in `handler`.

### 4. onChange

A function triggered when data in the `<One/>` form changes. For example, when the user's name changes.

## How do `columns` work in the layout?

> `columns` are responsible for the layout and work on a grid logic. They determine the width each element occupies. The maximum value is '12' (as `columns` is of type `string`), representing the full width. The value "6" would mean half the width, "4" is 1/3 width, "3" is 1/4, and so on. Note: the width refers to the parent's width. The default value is "12".

For example:

```tsx
{
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Rating,
        columns: "2",
        desktopColumns: '2',
        tabletColumns: '2',
        phoneColumns: '12',
        fieldBottomMargin: "0",
        fieldBottomMargin: "0",
        name: "rating",
        defaultValue: 3
      },
      {
        type: FieldType.Group,
        columns: "10",
        desktopColumns: '10',
        tabletColumns: '10',
        phoneColumns: '12',
        fields: [
          {
            name: 'name',
            type: FieldType.Text,
            title: 'Name',
          }
        ]
      }
    ]
}
```

In this example, the Rating element will occupy 20% of the width, and the second Group element will occupy 80% of the width.

`desktopColumns` used for desktop layout;

`tabletColumns` used for tablet layout;

`phoneColumns` used for smartphone layout;

You can adjust the bottom and right margin using `fieldBottomMargin` and `fieldRightMargin`, respectively.
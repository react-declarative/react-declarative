# One Component

> `<One />` is a component of the `react-declarative` library, representing a form with various fields (text, images, rating, etc.) and a grid layout. This layout allows for convenient storage, creation, and modification of data, such as a user's profile.

## Source code review:

1. [OneInternal](./code/OneInternal.md)
2. [OneGenesis](./code/OneGenesis.md)
3. [One](./code/One.md)
4. [IManaged](./code/IManaged.md)
5. [makeField](./code/makeField.md)
6. [TypedField](./code/TypedField.md)

## Props

1. fields

This is the primary aspect to work with. Here, you list the fields that should be in the form. It is defined through the `fields` variable (an array) with the type 'TypedField[]'.

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

2. handler

It should be a function (can return a promise) or a reference to the component's state. It is used to connect the component to the server or mock data. Through variable context composition, you can reach the `id` from the route.

3. fallback

A callback in case of an error in `handler`.

4. onChange

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

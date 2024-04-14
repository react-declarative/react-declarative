# The new code as the side effect

> Correct typing does not guarantee the structure's content.

Is this function a [pure](https://en.wikipedia.org/wiki/Functional_programming)  function?

```typescript
const sum = (a: any, b: any) => a + b;
```

At first glance, yes, however...

```typescript
const obj = new class {
  toString() { return Math.random().toString(36).substring(7) }
}

console.log(sum(obj, obj)) // uretdln9iue
console.log(sum(obj, obj)) // edzlrs4s6l8e
console.log(sum(obj, obj)) // 6l347arllc9q
console.log(sum(obj, obj)) // 529n5l8wn718
```

The correct way to write a pure function would be with typed input parameters...

```typescript
const sum = (a: number, b: number) => a + b;
```

This works with simple data types. But when attempting to define a complex data type with an interface, there is no guarantee of functional simplicity in the internal implementation, as the interface performs compile-time checks only.

```typescript
interface IObj {
  toString(): string;
}
```

The code presented below should be called **synchronous**  and **procedural** , but not **functional** , as the expansion of the set of fields with new code can be called a side effect.

```typescript
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

...

const selector = formValueSelector('selectingFormValues') 
SelectingFormValuesForm = connect((state) => {
  const hasEmailValue = selector(state, 'hasEmail')
  const favoriteColorValue = selector(state, 'favoriteColor')
  const { firstName, lastName } = selector(state, 'firstName', 'lastName')
  return {
    hasEmailValue,
    favoriteColorValue,
    canSubscribeByEmail: firstName && lastName,
    fullName: `${firstName || ''} ${lastName || ''}`
)(SelectingFormValuesForm)
```

The `mapStateToProps` function in this usage has an infinite list of returned values, which expands when the next development iteration updates the interface defining the form and implements a new field. It's procedure code, not functional

## Solution

> By ensuring the isolation of each field in the form, we can dramatically increase the number of pure functions, eliminating procedural code.

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
  }
]

...

<One
  fields={fields}
  onChange={console.log}
/>
```

The created component can: 

- **Render Markup** 

By specifying `phoneColumns`, `tabletColumns`, `desktopColumns`. Or simply `columns` if you don't want to bother. Fields can be grouped, groups can be nested. 

- **Render JSON obtained from Promise** 

During loading, a *placeholder* expressed by [Skeleton](https://material-ui.com/components/skeleton/)  is shown. After loading, the form is displayed. 

- **Connect directly to the component's state** 

Also, `One` can be connected to an object in the component's internal state directly. Very convenient, especially when rendering a list of template elements... 

- **Hide, disable, inform the user of input field errors** 

By using callbacks `isDisabled`, `isVisible`, `isInvalid`, we can disable, hide, and mark invalid input. Additionally, we can subscribe to `focus` and `blur` events for both individual fields and field groups (bubbling) or the entire `One` component. The field can be marked as `readonly` or specify a `compute` callback for value computation. 

- **Automate the creation of internal state** 

After declaratively describing the form, working through callbacks is done in a functional style with the passing of the snapshot of the last data object from the input fields (immutable). Also, asynchronous requests can be made if necessary. For text fields, `debounce` has already been applied to optimize the number of input checks... 

- **Single Responsibility Principle** 

What if you need to implement the ability to subscribe to an email newsletter (a form consisting of several nested components interacting through a state-props chain), but only for those users who have specified a middle name? Creating a context is potentially unsafe, as it does not guarantee absence of new edits. 

- **Notify the application programmer of changes on the form** 

By passing a callback to the `One` component's input parameter `change`, we can get user input, but the callback will only be called if all validations are successful. 

- **Display more than 10 built-in field types and custom components** 

Switch (toggle), Line (group outline), Group (field group), Expansion (expandable group), Radio (radio button), Checkbox (checkbox), Text (text field), Progress (progress bar), Slider (slider), Combo (dropdown), Items (multiple selection), Rating (rating), and Component (custom component) are available. 

- **Most likely, this list is already outdated** 

The component is actively being expanded.

## Code Example

> Just open [the link](https://jsfiddle.net/tripolskypetr/0pywxmsk/) in your browser...

Try experimenting with `isDisabled`, `isInvalid`, `isVisible`. The source code of the `<One />` component is open and can be viewed [here](https://github.com/react-declarative/react-declarative/blob/567f20da6579a9499d3ac413e5f0605b80a774aa/src/components/One/components/OneInternal/OneInternal.tsx).

```javascript
const fields = [
  {
    type: "group",
    fields: [
      {
        type: "line",
        title: "Glass Type"
      },
      {
        title: "Bronze",
        columns: "4",
        type: "checkbox",
        name: "Bronze"
      },
      {
        title: "Matte",
        columns: "4",
        type: "checkbox",
        name: "Matte"
      },
      {
        title: "Lightened",
        type: "checkbox",
        columns: "4",
        name: "Lightened"
      },
      {
        title: "Transparent",
        type: "checkbox",
        columns: "4",
        name: "Transparent"
      },
      {
        title: "Gray",
        columns: "4",
        type: "checkbox",
        name: "Gray"
      },
      {
        type: "group",
        fields: [
          {
            type: "line",
            title: "Glass Thickness"
          },
          {
            title: "10 mm",
            type: "radio",
            name: "Glass Thickness",
            radioValue: "10 mm"
          },
          {
            title: "12 mm",
            type: "radio",
            name: "Glass Thickness",
            radioValue: "12 mm"
          },
        ]
      }
    ]
  },
  {
    type: "group",
    fields: [
      {
        type: "line",
        title: "Comment"
      },
      {
        title: "Comment",
        type: "text",
        name: "Comment",
        inputRows: 5,
      },
    ]
  },
  {
    type: "group",
    fields: [
      {
        type: "line",
        title: "Delivery Method"
      },
      {
        title: "Pickup",
        type: "switch",
        name: "Pickup",
        inputType: 'date',
      },
      {
        title: "Address",
        type: "text",
        name: "Address",
        focus, blur,
        isDisabled: (obj) => obj["Pickup"]
      },
    ]
  },
  {
    type: "line",
    title: "Slider",
  },
  {
    type: "slider",
    name: "Slider",
    leadingIcon: VolumeDown,
    trailingIcon: VolumeUp,
    leadingIconClick(v, onChange) { onChange(v - 1) },
    trailingIconClick(v, onChange) { onChange(v + 1) }
  },
  {
    type: "line",
    title: "Lists",
  },
  {
    type: "group",
    fields: [
      {
        type: "group",
        columns: "6",
        fields: [
          {
            type: "combo",
            title: "Item Selection",
            description: "Selecting one item",
            name: "Item Selection",
            itemList: ["Item 1", "Item 2", "Item 3"]
          },
        ]
      },
      {
        type: "group",
        columns: "6",
        fields: [
          {
            type: "items",
            title: "Items Selection",
            description: "Selecting multiple items",
            name: "Items Selection",
            itemList: ["Item 1", "Item 2", "Item 3"]
          },
        ]
      },
    ]
  },
  {
    type: "line",
    title: "Custom Component"
  },
  {
    type: "component",
    compute: Logger,
  },
  {
    type: "rating",
    name: "Rating"
  }
];
```

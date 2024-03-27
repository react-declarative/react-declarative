# Form schema

Let's break down the following `TypedField[]` form schema

```tsx
const fields: TypedField[] = [
    {
        type: FieldType.Line,
        title: 'User info',
    },
    {
        type: FieldType.Condition,
        condition: () => false,
        child: {
            type: FieldType.Typography,
            placeholder: 'Condition not satisfied',
        }
    },
    {
        type: FieldType.Date,
        title: 'Date field',
        description: 'type a date',
        defaultValue: datetime.currentDate(),
        name: 'date',
    },
    {
        type: FieldType.Time,
        title: 'Time field',
        description: 'type a time',
        defaultValue: datetime.currentTime(),
        name: 'time',
    },
    {
        type: FieldType.Group,
        phoneColumns: '12',
        tabletColumns: '6',
        desktopColumns: '4',
        fieldRightMargin: '0',
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
                /*sx: {
                    background: 'green'
                }*/
            },
            {
                type: FieldType.Text,
                title: 'Email',
                defaultValue: 'tripolskypetr@gmail.com',
                description: 'Gmail. Yahoo, Yandex...',
                name: 'email',
            },
            {
                type: FieldType.Text,
                title: 'Snils',
                name: 'snils',
                inputFormatterTemplate: '##-#-###-### ##',
                inputFormatterSymbol: '#',
                inputFormatterAllowed: /^[0-9]/,
            }
        ],
    },
    {
        type: FieldType.Group,
        phoneColumns: '12',
        tabletColumns: '6',
        desktopColumns: '4',
        fieldRightMargin: '0',
        fields: [
            {
                type: FieldType.Combo,
                name: 'gender',
                title: 'Gender',
                freeSolo: true,
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
                defaultValue: 'their-unique-key',
            },
            {
                type: FieldType.Items,
                name: 'lists',
                title: 'User lists',
                freeSolo: true,
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
            },
            {
                type: FieldType.Text,
                inputType: 'number',
                title: 'Age',
                defaultValue: '21',
                description: '25',
                name: 'How old are you?',
            },
        ],
    },
    {
        type: FieldType.Group,
        phoneColumns: '12',
        tabletColumns: '6',
        desktopColumns: '4',
        fieldRightMargin: '0',
        fields: [
            {
                type: FieldType.Text,
                name: 'phone',
                title: 'Phone',
                description: 'Your phone',
                inputType: 'tel',
                defaultValue: '8999',
            },
            {
                type: FieldType.Text,
                name: 'fax',
                title: 'Fax',
                description: 'Your fax',
                inputType: 'tel',
                defaultValue: '8999',
            },
        ],
    },
    {
        type: FieldType.Text,
        name: 'comment',
        title: 'Any comment',
        inputRows: 4,
    },
    /*{
        type: FieldType.Component,
        compute: (props) => <small>{props.comment}</small>
    }*/
];
```

This form is a part of the application where these fields might be used for creating forms or gathering user input. Each part of code does:

1. The array `fields` contains a list of subfield objects.

2. Each field object has properties defining its type, title, default value, description, name, and potentially other specific properties depending on the type of field.

3. The fields are categorized into groups, each with its own set of fields. 

4. Each field has a `type` property which determines its behavior and appearance. Possible types include Line, Condition, Date, Time, Group, Text, Combo, Items, and Component. 

5. Some fields have additional properties specific to their type. For example, Text fields might have properties like `inputType`, `inputRows`, `inputFormatterTemplate`, `inputFormatterSymbol`, `inputFormatterAllowed`, `leadingIcon`, `focus`, and `blur`. Combo and Items fields have asynchronous functions `itemList` and `tr` for fetching and translating items respectively. 

6. The `defaultValue` property sets the initial value of the field. 

7. The `description` property provides additional information or instructions about the field. 

8. Conditional rendering is supported with the `FieldType.Condition` type. 

This code snippet is a template for a form-building system where developers can define fields with various properties to create dynamic and customizable forms which called `react-declarative`.

The template uses `phoneColumns`, `tabletColumns`, and `desktopColumns` are properties used within the `FieldType.Group` objects for defining the layout or column widths of the fields within each group for different device sizes (phone, tablet, and desktop).

Here's a brief explanation of each: 

1. `phoneColumns`: This property defines the number of columns the fields within the group should occupy on a phone-sized screen. It likely helps in setting up responsive layouts where the fields adjust their width based on the available screen space on a mobile device. 

2. `tabletColumns`: Similar to `phoneColumns`, this property specifies the number of columns the fields should occupy on a tablet-sized screen. Tablets typically have larger screens than phones, so this property allows for adjusting the layout to make optimal use of the available space. 

3. `desktopColumns`: This property determines the number of columns the fields should occupy on a desktop-sized screen. Desktop screens are usually larger than tablets and phones, so this property enables setting up more complex layouts or displaying more fields side by side on larger screens.

By specifying these properties for each group of fields, the code can create responsive layouts that adapt to different screen sizes, providing a consistent user experience across various devices. It's a common practice in web development to use such layout properties to ensure that interfaces are accessible and user-friendly across a range of devices and screen sizes.

The `type` field is used to specify the type of each field within the form. It is a crucial property that determines the behavior and appearance of the field when rendered in a user interface. Here's an overview of how the `type` field is used: 

1. **FieldType.Line** : This type is likely used to represent a visual separator or a section header in the form. It's used to visually organize different sections of the form. 

2. **FieldType.Condition** : This type indicates that the field is conditionally rendered based on a given condition. In the provided code snippet, the condition is hardcoded as `() => false`, which means the field won't be rendered since the condition always evaluates to `false`. 

3. **FieldType.Date** : This type represents a field for inputting dates. It typically provides a date picker or a calendar widget for selecting dates. 

4. **FieldType.Time** : Similar to `FieldType.Date`, this type represents a field for inputting times. It usually provides a time picker or input field for entering time values. 

5. **FieldType.Group** : This type represents a group of fields. It's used to logically group related fields together, allowing for better organization and layout control. Groups can also have layout properties like `phoneColumns`, `tabletColumns`, and `desktopColumns` to define their appearance on different devices. 

6. **FieldType.Text** : This type represents a field for inputting text. It could be used for various purposes such as entering names, emails, phone numbers, or any other textual data. 

7. **FieldType.Combo** : This type represents a field for selecting an option from a predefined list or allowing free-text input. It's typically used for dropdowns or auto-complete text fields. 

8. **FieldType.Items** : This type is similar to `FieldType.Combo`, but it's specifically designed for selecting multiple items from a list. 

9. **FieldType.Component** : This type allows for integrating custom components or elements into the form. It's useful for adding custom functionality or displaying dynamic content within the form.

By using the `type` field, the code can define various types of fields with different behaviors and appearances, allowing for the creation of dynamic and interactive forms tailored to specific use cases. The `react-declarative` library contains more of FieldTypes, here's the only used in this template. 

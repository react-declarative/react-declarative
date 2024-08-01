# Form schema

> If you searching for the field interface defenition, seek for [src/components/One/fields](https://github.com/react-declarative/react-declarative/tree/3e6d7b6283491d77ae53164e6e3ea269f39fe80c/src/components/One/fields) folder. If you searching for the field implementation search for [src/components/One/components/SlotFactrory/components](https://github.com/react-declarative/react-declarative/tree/3e6d7b6283491d77ae53164e6e3ea269f39fe80c/src/components/One/components/SlotFactrory/components) folder

The `<One />` template engine allows programmer to build huge forms with powerful business logic in functional + declarative style. Let's start our journey with several code snippets

## Layout description

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

## Validation description

Let's describe the next form schema

```tsx
const fields: TypedField<IOneData>[] = [
    {
        type: FieldType.Text,
        inputType: 'email',
        inputAutocomplete: 'on',
        name: 'email',
        title: 'Email',
        trailingIcon: Email,
        // defaultValue: 'tripolskypetr@gmail.com',
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
        type: FieldType.Fragment,
        isVisible({visible}) {
            return visible;
        },
        fields: [
            {
                type: FieldType.Text,
                name: 'number',
                title: 'Number',
                description: 'Only number allowed',
                isInvalid({number}) {
                    if (isNaN(number as any) || number === '') {
                        return 'It is not a number';
                    }
                    return null;
                },
            },
        ],
    },
    {
        type: FieldType.Text,
        sx: { pt: 1 },
        columns: '3',
        inputFormatterAllowed: /^[0-9.]/,
        inputFormatterTemplate: "000000000000000",
        name: 'from',
        isInvalid: ({ from, to }) => {
            if (!from) {
                return null;
            }
            if (!to) {
                return null;
            }
            if (parseInt(from) > parseInt(to)) {
                return "From > to";
            }
            return null;
        },
        defaultValue: '50',
    },
    {
        type: FieldType.Text,
        columns: '3',
        inputFormatterAllowed: /^[0-9.]/,
        inputFormatterTemplate: "000000000000000",
        name: 'to',
        isInvalid: ({ from, to }) => {
            if (!from) {
                return null;
            }
            if (!to) {
                return null;
            }
            if (parseInt(from) > parseInt(to)) {
                return "From > to";
            }
            return null;
        },
        defaultValue: '150',
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
            {
                type: FieldType.Switch,
                title: 'Mark as disabled',
                name: 'disabled',
            },
        ],
    },
];
```

 - The `isInvalid` callback is a function used for validating the input value of a form field. It's typically used in scenarios where the validation logic is more complex or dynamic than what can be achieved with simple HTML5 input attributes or built-in form validation mechanisms.

In the provided code snippet, the `isInvalid` callback is defined within each field object. It takes an object containing the current form field values as its parameter (referred to as `{email}`, `{number}`, `{from}`, `{to}`, etc., depending on the field it belongs to). This parameter allows the callback to access the current value of the field being validated and potentially other related fields.

The `isInvalid` callback returns a validation error message if the input value is considered invalid based on the defined criteria. If the input is valid, the callback returns `null`.

Here's a breakdown of how it's used: 

- **Validation Logic** : Inside the `isInvalid` function, custom validation logic is implemented. For example, in the case of the email field, a regular expression is used to check if the email address is in a valid format. 

- **Return Value** : If the input value fails the validation criteria, the `isInvalid` function returns an error message describing why the input is invalid. If the input is valid, it returns `null`. 

- **Usage** : The returned error message, if any, can be utilized to display feedback to the user indicating what needs to be corrected in the input field. This could be done by showing an error message near the field or by disabling form submission until all fields are valid.

This approach allows for more customized and dynamic validation behaviors, such as cross-field validation or validation based on external conditions.

- The `inputFormatterAllowed` and `inputFormatterTemplate` properties are used to control the formatting of input values in text fields. These properties are commonly utilized in scenarios where you want to enforce a specific format for user input, such as phone numbers, credit card numbers, or any other data that follows a particular pattern. 

1. **inputFormatterAllowed** :

- This property specifies a regular expression that defines the characters allowed in the input field. Only the characters that match the regular expression will be accepted as input. Any other characters will be rejected or ignored. 
- For example, if `inputFormatterAllowed` is set to `/^[0-9.-]/`, it means only digits (0-9), dots (.), and hyphens (-) will be allowed in the input field. Any other characters will not be accepted.
- This property helps enforce input restrictions, ensuring that users can only input characters that are relevant to the data being collected. 

2. **inputFormatterTemplate** :

- This property defines a template for formatting the input value visually. It specifies the pattern or structure that the input value should follow. 
- The template typically consists of placeholders for characters (e.g., `0` for digits) and other formatting characters (e.g., `-`, `.`) to represent the desired format. 

- For example, a template of `"000-00-0000"` might be used for formatting social security numbers in the format `123-45-6789`.
- When a user types in the input field, the actual input value is formatted according to this template, visually representing the expected format.
- This property is used for enhancing user experience by providing visual cues about the expected input format and helping users input data correctly.

Together, these properties enable developers to control the input format and enforce consistency in the data entered by users. They are particularly useful when dealing with data that needs to adhere to specific patterns or formats, such as dates, times, or identification numbers.

- The `isVisible` and `isDisabled` callbacks are functions used to dynamically control the visibility and disabled state of form fields, respectively. These callbacks allow developers to implement logic that determines whether a field should be visible or disabled based on certain conditions or external factors. 

1. **isVisible Callback** : 

- The `isVisible` callback is used to determine whether a form field should be visible to the user. 
- It takes an object containing the current state or context of the form as its parameter (e.g., `{visible}`, `{disabled}`), allowing the callback to access relevant information needed to make the visibility decision. 
- The callback returns a boolean value: `true` if the field should be visible and `false` if it should be hidden.
- Developers typically implement logic inside this callback to evaluate conditions such as user permissions, the state of other fields, or any other factors that influence the visibility of the field.
- For example, a field might be conditionally hidden based on whether a user has selected a specific option in another part of the form. 

2. **isDisabled Callback** : 

- The `isDisabled` callback is used to determine whether a form field should be disabled, meaning it cannot be interacted with by the user. 
- Similar to `isVisible`, it takes an object containing the current state or context of the form as its parameter, allowing the callback to access relevant information. 
- Like `isVisible`, this callback returns a boolean value: `true` if the field should be disabled and `false` if it should be enabled.
- Developers implement logic inside this callback to evaluate conditions such as user permissions, the state of other fields, or any other factors that influence whether the field should be disabled.
- For example, a field might be disabled if another field has a certain value, or if the user lacks the necessary permissions to modify the data in that field.

By using these callbacks, developers can create dynamic and interactive forms that adapt to the context of the user's interaction, enhancing usability and guiding users through the input process effectively. These callbacks are commonly used in frameworks like React or Angular to build dynamic user interfaces.

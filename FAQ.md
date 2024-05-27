# react-declarative

## Few words about react-declarative library

**react-declarative** is an npm library that provides a powerful set of tools for building React applications in a **declarative style**. Let’s dive into the details:

1.  **What Is react-declarative?**
    
    *   **Library Purpose**: React-declarative is a framework that simplifies UI development by allowing you to express **what** your UI should look like, rather than specifying the exact steps to achieve it.

    *   **Core Features**:
        *   **Form Builder**: It interacts with a JSON endpoint to generate nested 12-column grids with input fields and automatic state management in a declarative manner.
        *   **Dashboard Adaptive Cards Builder**: Create adaptive cards for dashboards.
        *   **CRUD-Based Grid Component**: Simplify data management with a grid component.
        *   **Rapid Application Development**: Provides its own way of managing app state.
    *   [**TypeScript Support**: The endpoint is typed by TypeScript guards, making IntelliSense available for better development experience](https://www.npmjs.com/package/react-declarative)[1](https://www.npmjs.com/package/react-declarative).

2.  **Getting Started**:
    
    *   You can use the create-react-app template provided by react-declarative:
        *   To create a new app: `yarn create react-app --template cra-template-react-declarative .`
        *   Or using NPX: `npx create-react-app . --template=react-declarative`
    *   Installation: Run `npm install --save react-declarative tss-react @mui/material @emotion/react @emotion/styled`.
    *   [Explore the demo folder for sample apps and check out the project’s storybook for new features](https://www.npmjs.com/package/react-declarative)[1](https://www.npmjs.com/package/react-declarative).

3.  **Starter Kits**:
    
    *   Several starter kits are available:
        1.  **Pure React Starter**: [GitHub Repo](https://github.com/react-declarative/cra-template-react-declarative)
        2.  **Ethers.js/React Starter**: [GitHub Repo](https://github.com/react-declarative/cra-template-solidity)
        3.  **AppWrite/React Starter**: [GitHub Repo](https://github.com/react-declarative/cra-template-appwrite)

    *   Interesting demo projects:
        *   **ERC-20 Payment Gateway**: [GitHub Repo](https://github.com/react-declarative/erc20-payment-gateway)
        *   **React Face KYC**: [GitHub Repo](https://github.com/react-declarative/react-face-kyc)
        *   **BrainJS Cryptocurrency Trend**: [GitHub Repo](https://github.com/react-declarative/brainjs-cryptocurrency-trend)
        *   [**NFT Mint Tool**:](https://www.npmjs.com/package/react-declarative) [GitHub Repo](https://github.com/react-declarative/nft-mint-tool)[1](https://www.npmjs.com/package/react-declarative)

4.  **Declarative Scaffold Component**:
    
    *   The `<Scaffold2 />` component implements the basic Material Design visual layout structure using configuration instead of manual UI element composition.
    *   Example options for the scaffold:
        ```tsx
        const options = [
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
                            { id: 'tab1', label: 'Tab1 in header' },
                            { id: 'tab2', label: 'Tab2 in header' },
                        ],
                        options: [
                            { id: 'tab1', label: 'Tab1 in side menu' },
                            { id: 'tab2', label: 'Tab2 in side menu' },
                        ],
                    },
                    // Other sections...
                ],
            },
            // Other groups...
        ];
        ```
        
    *   [This declarative approach simplifies UI development and makes your code more predictable](https://www.npmjs.com/package/react-declarative)[1](https://www.npmjs.com/package/react-declarative).

In summary, react-declarative empowers you to build React applications with a focus on expressing your desired UI outcomes in a declarative manner. [Happy coding! 😊🚀](https://www.npmjs.com/package/react-declarative)[1](https://www.npmjs.com/package/react-declarative)


## How does react-declarative handle state management?

**React-declarative** provides its own way of handling state management in a declarative manner. Let’s explore how it achieves this:

1.  **State Management in React**:
    
    *   In React, state management is crucial for handling data that changes over time. Components can have local state (managed within the component) or global state (shared across components).

    *   Common approaches for state management include:
        *   **Local State**: Using `useState` or `this.state` within a component.
        *   **Context API**: For sharing state across components without prop drilling.
        *   **Redux**: A popular library for managing global state.
        *   **MobX**: Another library for state management.
        *   **Apollo Client**: For managing state in GraphQL applications.

    *   Each approach has its pros and cons, and the choice depends on the complexity of your application and your preferences.

2.  **Declarative State Management in react-declarative**:
    
    *   React-declarative introduces its own way of managing state, emphasizing a declarative approach.
    *   The core concept is to define your state requirements declaratively, and the framework handles the rest.
    *   Here’s how it works:
        *   You define your state requirements using configuration objects.
        *   The framework generates the necessary components and manages their state.
        *   You interact with the generated components as needed.
    *   Example of declarative state management in react-declarative:
    
        ```tsx
        const options = [
            {
                id: 'build',
                label: 'Build',
                children: [
                    {
                        id: 'authentication',
                        label: 'Authentication',
                        isVisible: async () => await ioc.authService.hasRole('unauthorized'),
                        // Other properties...
                    },
                    // Other sections...
                ],
            },
            // Other groups...
        ];
        ```
        
    *   In this example, the `isVisible` property determines whether the “Authentication” section should be visible based on the user’s role. The framework handles the state and rendering.

3.  **Benefits of Declarative State Management**:
    
    *   **Predictability**: Declarative state management simplifies your code and makes it more predictable. You express what you want, and the framework handles the implementation details.
    *   **Abstraction**: By abstracting away state management complexities, react-declarative allows you to focus on building UIs.
    *   **Efficiency**: The framework efficiently updates components when state changes, thanks to its declarative nature.

In summary, react-declarative handles state management by allowing you to express your state requirements declaratively, and it takes care of the underlying implementation. It’s an interesting alternative for those who prefer a declarative approach to state management in React applications! 😊🚀

## How does react-declarative handle asynchronous state updates?

**React-declarative** handles asynchronous state updates in a way that aligns with its declarative philosophy. Let’s explore how it achieves this:

1.  **Declarative Approach to Asynchronous State**:
    
    *   React-declarative encourages you to express your state requirements declaratively, even when dealing with asynchronous updates.
    *   Instead of manually managing asynchronous operations (like fetching data from an API), you define the desired outcome and let the framework handle the implementation details.

2.  **Example Scenario**:
    
    *   Imagine you have a component that needs to fetch user data from an API and display it. Here’s how react-declarative handles this:
    
        ```tsx
        const options = [
            {
                id: 'userProfile',
                label: 'User Profile',
                isVisible: true,
                async load: async () => {
                    // Simulate fetching user data from an API
                    const userData = await fetchUserData();
                    return userData;
                },
                render: (data) => {
                    // Render the user profile using the fetched data
                    return (
                    <div>
                        <h2>{data.name}</h2>
                        <p>Email: {data.email}</p>
                        {/* Other profile details */}
                    </div>
                    );
                },
            },
            // Other sections...
        ];
        ```
        
    *   In this example:
        *   The `load` function fetches user data asynchronously.
        *   The `render` function receives the fetched data and renders the user profile.
        *   You express the desired outcome (showing the user profile) without worrying about the API call details.

3.  **Benefits**:
    
    *   **Predictability**: By expressing your intent declaratively, you make your code more predictable.
    *   **Abstraction**: React-declarative abstracts away the complexities of handling asynchronous operations.
    *   **Efficiency**: The framework ensures that components update appropriately when data arrives.

4.  **Error Handling**:
    
    *   React-declarative also provides error handling mechanisms. For example, you can define an `onError` callback to handle errors during data fetching.

In summary, react-declarative simplifies asynchronous state management by allowing you to express your intent declaratively. It’s a powerful approach that aligns well with React’s core principles! 😊🚀

## How does it handle form validation?

The react-declarative library handles form validation by building it into the UI schema1. This means that all validations are defined within the UI schema, so the backend endpoint can be changed partially if some properties are unused

Each form schema can be reflected by using `getAvailableFields` for additiona inline validations, data cleanup if some fields are not required anymore, data export. This allows for a high degree of flexibility and control over form validation.

Here’s an example of how you might use the isInvalid callback in a react-declarative form schema. This example assumes you have a form with a single input field for an email address, and you want to validate that the input is a properly formatted email address.

```tsx
import { TypedField, FieldType } from "react-declarative";

export const fields: TypedField[] = [
   {
        type: FieldType.Text,
        title: 'Only number allowed',
        description: 'Which will not be greater or lower than 42',
        name: 'text',
        isInvalid(obj) {
            if (isNaN(obj.text)) {
                return 'It is not a number';
            }
            if (obj.text != 42) {
                return 'The number is greater or lower than 42';
            }
            return null;
        },
    },
    {
        name: 'email',
        type: FieldType.Text,
        isInvalid:  ({ email }) => {
            const expr = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            if (!expr.test(email)) {
                return 'Invalid email address provided';
            }
            else {
            return null;
            }
        },
        title: 'Email',
        description: 'tripolskypetr@gmail.com'
    },
];
```

Moreover, react-declarative provides every callback you need: field or group of fields focus/blur event, form invalidity state, data-testid and more. This makes it easy to handle form validation and provide clear feedback to users.

## An example sign up form

> Read the `docs/readme.md` and make me a sign up form with `<One />` component from a file

Here’s an example of how you can create a sign-up form using the `<One />` component:

```typescript
import React from 'react';
import { One, FieldType } from 'react-declarative';

const SignUpForm = () => {
    const fields = [
    {
        type: FieldType.Text,
        title: 'Username',
        name: 'username',
        placeholder: 'Enter your username',
    },
    {
        type: FieldType.Text,
        title: 'Email',
        name: 'email',
        placeholder: 'Enter your email',
    },
    {
        type: FieldType.Password,
        title: 'Password',
        name: 'password',
        placeholder: 'Enter your password',
    },
    {
        type: FieldType.Password,
        title: 'Confirm Password',
        name: 'confirmPassword',
        placeholder: 'Confirm your password',
    },
    {
        type: FieldType.Checkbox,
        title: 'I agree to the terms and conditions',
        name: 'terms',
    },
    {
        type: FieldType.Button,
        title: 'Sign Up',
        name: 'signup',
    },
    ];

    return <One fields={fields} />;
};

export default SignUpForm;
```

This is a simple sign-up form with fields for username, email, password, confirm password, and a checkbox for terms and conditions. Modify it according to your needs. Remember to implement the necessary validation and submission logic.

## What are the performance considerations when using this library?

When using the react-declarative npm library, or any library in general, there are several performance considerations to keep in mind:

 - Optimization: Popular libraries are usually well put together and optimized for performance. The react-declarative library is no exception. It provides a declarative way to manage application state and build UI components, which can lead to more efficient code.

 - Customizability: While libraries provide pre-built components and functionality, they may not always fit your specific needs. Customizing these libraries can sometimes lead to performance issues. However, most libraries, including react-declarative, allow for customization12.

 - Updates and Maintenance: Libraries that are regularly updated and maintained often perform better because they incorporate the latest optimizations and bug fixes. The react-declarative library is actively maintained, and new features appear frequently12.

 - Usage: Incorrect or inefficient use of a library can lead to performance issues. It’s important to understand how to use the react-declarative library effectively. Reading the project’s storybook, browsing sample projects, and reading the source code can help you understand how to use the library effectively12.

Remember, every application is unique, and what works best for one application might not work as well for another. It’s important to profile and test your application to understand how the react-declarative library impacts its performance

## What are some best practices when using this library?

When using the react-declarative npm library, here are some best practices to follow:

 - Understand Declarative Programming: React is based on the concept of declarative programming. This means you tell React what you want to happen, and it figures out how to implement it1. Understanding this concept will help you use react-declarative more effectively.

 - Read the Documentation: The official documentation2 is a great resource to understand the library’s features and how to use them. It also provides examples and demos that can be very helpful.
 
 - Use the Provided Tools: react-declarative provides several tools like form builders, adaptive cards builder, and CRUD-based grid components2. Make sure to utilize these tools to simplify your development process.
Check the Source Code: The source code of the library is available and can be a great resource to understand how the library works and how to use it effectively2.

 - Stay Updated: The library is actively maintained and new features appear frequently2. Staying updated with the latest changes can help you take advantage of new features and improvements.

 - Use Starter Kits: There are several starter kits available that can help you get started with your projects2. These kits provide a solid foundation and can save you a lot of time.

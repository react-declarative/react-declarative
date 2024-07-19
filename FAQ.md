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

## How does it compare to other form libraries like Formik?

`react-declarative` and `Formik` are both popular libraries for handling forms in React applications, but they have different approaches and features that might make one more suitable for your project than the other.

Here’s a comparison of `react-declarative` and Formik:

 - Size and Dependencies: `react-declarative` is based on Material-UI and has dependencies like tss-react and @mui/material. Formik, on the other hand, is known for having a smaller bundle size and fewer dependencies

 - Declarative Approach: `react-declarative` emphasizes a declarative approach to form building and state management, which can lead to more predictable and easier-to-debug code. Formik also supports a declarative style but is more imperative in how you handle form state and validation.

 - Ease of Use: Formik is often praised for its simplicity and ease of use, with a straightforward API that’s easy to understand and integrate into React projects. It provides a set of handy utilities and components for building forms, with built-in support for validation and error handling. It works for `react-declarative` too

 - Performance: In terms of performance, Formik has been optimized to minimize unnecessary re-renders, which is crucial for larger applications. However, `react-declarative` also aims to provide efficient performance, especially when used with its JSON endpoint for automatic state management. The benefit of `react-declarative` is implementation of reconciler algorithm for smooth rerenders for better user experience.

 - Ultimately, the choice between `react-declarative` and Formik will depend on your specific needs, the complexity of your forms, and your preference for a more declarative or imperative approach to form handling. It’s always a good idea to try out both libraries in a small project to see which one fits better with your workflow and coding style.

## How does it compare to other React libraries?

Comparing `react-declarative` to other React libraries can help you understand its unique strengths and potential use cases:

1.  **Declarative Syntax**:
    
    -   **react-declarative**: Focuses on a highly declarative approach, especially for form building and state management.
    -   **React Hook Form**: Also declarative but more focused on form validation and performance optimization.
    -   **Formik**: Provides a declarative way to build forms but requires more boilerplate compared to `react-declarative`.

2.  **TypeScript Integration**:
    
    -   **react-declarative**: Strong TypeScript support with guards for endpoints.
    -   **React Query**: Excellent TypeScript support for data fetching and caching.
    -   **Redux Toolkit**: Provides TypeScript support for state management but can be more complex to set up.

3.  **UI Components**:
    
    -   **react-declarative**: Uses Material-UI components out of the box.
    -   **Chakra UI**: Another popular library with a focus on accessibility and theming.
    -   **Ant Design**: Offers a comprehensive set of high-quality components but with a different design language.\

4.  **Rapid Development**:
    
    -   **react-declarative**: Simplifies app state management and includes features like adaptive cards and CRUD-based grids.
    -   **Next.js**: Provides a framework for server-side rendering and static site generation, enhancing development speed.
    -   **Gatsby**: Focuses on static site generation with a rich plugin ecosystem.

5.  **Starter Kits**:
    
    -   **react-declarative**: Offers various starter kits for different use cases.
    -   **Create React App**: A widely-used starter kit for React applications.
    -   **Next.js**: Comes with its own starter templates for different types of projects.

Each library has its own strengths and is suited for different types of projects. It often comes down to your specific needs and preferences. Are you looking for something specific in a React library?

## What are some real-world use cases for this library?

Certainly! Here are some real-world use cases where you might find react-declarative beneficial:

1. Form Management:
 - The primary use case for react-declarative is form management. If your application requires complex forms with various input fields, validation rules, and state management, this library can simplify the process.
 - Whether it’s a simple contact form, a multi-step registration process, or a data-intensive form for collecting user information, react-declarative can help you build and manage forms efficiently.

2. Admin Dashboards and Data Entry Applications:
 - react-declarative provides a declarative way to create admin dashboards and data entry interfaces. You can define layouts, grids, and form components using JSON configuration.
 - If you’re building an internal tool, an enterprise application, or any system where users need to input data, react-declarative can streamline the development process.

3. Rapid Prototyping and MVPs:
 - When you’re in the early stages of a project and need to quickly create a functional prototype or minimum viable product (MVP), react-declarative allows you to focus on functionality rather than spending time on manual UI setup.
 - You can iterate faster by defining your views declaratively and adjusting them as needed.

4. Dynamic Form Generation:
 - Imagine scenarios where you need to generate forms dynamically based on user roles, permissions, or other conditions. react-declarative’s JSON-based approach makes it easier to adapt your forms without extensive code changes.
 - For example, an e-commerce platform might have different checkout forms for guest users, registered users, and administrators. react-declarative can handle these variations seamlessly.

5. Customizable User Profiles and Settings Pages:
 - User profile pages often include forms for updating personal information, changing passwords, and managing preferences. react-declarative can help you create these pages with consistent styling and validation.
 - By defining the form structure in a JSON format, you can easily customize the user experience without diving into the implementation details.

6. Integration with Backend APIs:
 - When your frontend interacts with backend APIs, react-declarative can be a bridge between the two. You can define form fields that map directly to API endpoints, making it easier to handle data submission and validation.
 - Whether you’re working with RESTful APIs, GraphQL, or other data sources, react-declarative simplifies the communication layer.

7. Multi-Step Wizards and Surveys:
 - Some applications require multi-step wizards (e.g., onboarding flows, configuration wizards) or surveys with conditional questions. react-declarative allows you to create these step-by-step processes with ease.
 - Define each step as a separate form section, and let react-declarative handle the navigation and state management.

## What are the benefits of using this library over other UI libraries?

 Let’s explore the benefits of using react-declarative over other UI libraries:

1. Declarative Approach:
 - As the name suggests, react-declarative emphasizes a declarative approach to building UI components. You define the desired UI structure using configuration or data, rather than manually composing UI elements. This leads to cleaner, more maintainable code.
 - By focusing on declarative patterns, react-declarative aligns well with React’s core philosophy.

2. Form Building Made Easy:
 - One of the standout features of react-declarative is its form builder. You can create complex forms using a JSON endpoint. The library generates nested 12-column grids with input fields and handles state management automatically.
 - If your application involves forms, react-declarative can significantly simplify the process.

3. Material-UI Integration:
 - react-declarative is built on top of Material-UI (MUI) components. MUI provides a set of beautiful, consistent UI elements based on Google’s Material Design guidelines.
 - By leveraging MUI components, your application will have a polished and professional look across different devices.

4. Rapid Application Development (RAD):
 - Developers often need to build prototypes or MVPs quickly. react-declarative’s simplicity and form-building capabilities make it suitable for rapid development.
 - Whether you’re creating internal tools, admin dashboards, or simple apps, react-declarative can accelerate your development process.

5. Dashboard and Adaptive Cards Support:
 - Beyond forms, react-declarative offers tools for building dashboards and adaptive cards. These features are useful for creating data visualization interfaces or interactive content.

6. TypeScript Support:
 - The library is typed by TypeScript guards, providing excellent IntelliSense and type safety during development.
 - If you’re a TypeScript enthusiast, react-declarative’s type support will enhance your development experience.

7. Sample Projects and Starter Kits:
 - react-declarative provides starter kits for various use cases, including pure React, Ethers.js/React, and AppWrite/React.
 - These starter kits help you kickstart your project with a solid foundation.

8. Community and Active Development:
 - The library has an active community and contributors. You’ll find support, documentation, and examples on GitHub.
 - Explore the demo projects and sample repositories to see react-declarative in action.

## Is there any community support or documentation available?

Certainly! The react-declarative npm library has both community support and documentation. Let me provide you with some details:

1. Community Support:
 - The library is actively maintained and has a growing community of users.
 - You can find discussions, ask questions, and seek help in the library’s GitHub repository1.
 - Additionally, there are other projects in the npm registry that use react-declarative, which indicates its adoption and community interest2.

2. Documentation:
 - The library’s documentation includes essential information on how to use it effectively.
 - You can explore the following resources:
 - Storybook: The project’s storybook provides interactive examples and showcases various features of react-declarative2.
 - Playground: You can try out the library without installing it directly in your web browser. The playground allows you to experiment with different components and configurations1.
 - Docs Folder: Check the docs folder in the GitHub repository for additional guides and explanations1.
 - Guide for AI Integration: If you’re interested in using GPT-4 to generate form schemas automatically, there’s a guide available in the documentation1.

3. Features Beyond Forms:
 - While react-declarative is known for its form-building capabilities, it’s more versatile than just creating forms.
 - You can use it to build various UI components, including dashboards, CRM and ERP interfaces, and mobile apps.
 - The library simplifies app state management, making it suitable for rapid application development1.

4. Adjectives Describing react-declarative:
 - Accessible: Provides callbacks for field events, form invalidity state, and more.
 - Configurable: Allows static and dynamic field visibility and other settings.
 - Extendable: Supports field type overrides and custom JSX injection.
 - Performant: Even on older devices (e.g., 2016 devices) due to optimizations.
 - Maintainable: Reduces technical debt by integrating validations into the UI schema.
 - Reflectable: Enables additional inline validations and data cleanup based on form schema.

## How to build a Google-like settings form based on top of code in that markdown file

A Google Account settings form based on the code in the markdown file you provided. Here’s how you can modify [the existing code](./docs/sample/account_info.md) to create a Google Account settings form:

```tsx
import { TypedField, FieldType } from "react-declarative";

declare var RemoveAccount: any;
declare var AvatarPicker: any;

const personalFields: TypedField[] = [
  {
      type: FieldType.Line,
      title: 'Personal info',
  },
  {
      type: FieldType.Component,
      fieldBottomMargin: '0',
      element: () => <AvatarPicker />
  },
  {
      type: FieldType.Text,
      fieldRightMargin: '0',
      outlined: true,
      name: 'global.login',
      title: 'Nickname',
      description: 'A nickname linked to this Google account',
  },
  {
      type: FieldType.Text,
      fieldRightMargin: '0',
      outlined: true,
      name: 'global.email',
      readonly: true,
      title: 'Email (Readonly)',
      description: 'An email address linked to this Google account',
  },
];

const notifyFields: TypedField[] = [
  {
      type: FieldType.Line,
      title: 'Notifications',
  },
  {
      type: FieldType.Expansion,
      fieldRightMargin: '0',
      fieldBottomMargin: '1',
      title: 'Google Services',
      fields: [
          {
              type: FieldType.Switch,
              name: 'notify.googleServices',
              fieldRightMargin: '0',
              title: 'Google Services',
              fieldBottomMargin: '0',
          },
          {
              type: FieldType.Typography,
              typoVariant: 'subtitle2',
              placeholder: 'Toggle Google Services notifications',
              style: {
                  opacity: 0.5,
              },
              fieldBottomMargin: '0',
          },
      ],
  },
];

const dangerFields: TypedField[] = [
  {
      type: FieldType.Line,
      title: 'Danger',
  },
  {
      type: FieldType.Component,
      element: () => <RemoveAccount />,
  },
];

export const fields: TypedField[] = [
  ...personalFields,
  ...notifyFields,
  ...dangerFields,
];
```

In this code, I’ve replaced the ‘Moderations’, ‘Payments’, and ‘Withdraws’ sections with a ‘Google Services’ section under ‘Notifications’. This section contains a switch to toggle notifications for Google Services. The ‘Personal info’ section remains the same, and the ‘Danger’ section still contains the option to remove the account. Please replace the RemoveAccount and AvatarPicker components with your own implementations.

Remember to install the `react-declarative` library if you haven’t already done so. You can install it using npm:

```
npm install react-declarative
```

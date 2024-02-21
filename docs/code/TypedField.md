# TypedField

> Link [to the source code](../../src/model/TypedField.ts)

The TypedField interface provides a structured way to define and manage different types of form fields and layouts in a React application using TypeScript. It facilitates type-checking and autocompletion for developers working with these components.

1. **Imports:**  

- Various interfaces (`IFragmentLayoutProps`, `IDivLayoutProps`, etc.) related to different layout types and field types are imported. 
- `IManaged` and `IManagedShallow` are imported from './IManaged'. 
- `IEntity` is imported from './IEntity'. 
- `FieldType` is imported from './FieldType'. 
- `IAnything` is imported from './IAnything'. 

2. **Fields and Layouts:**  

- Types like `Group`, `Custom`, `Paper`, `Outline`, etc., are defined using the `TypedFieldFactory` and `TypedFieldFactoryShallow` generics. These types represent different types of layouts and fields. 

3. **TypedFieldFactory:**  

- Generic type `TypedFieldFactory` is defined, which takes a `Type` (enum for field or layout type), `Fields` (interface for props), `Data`, and `Payload`. 

- It creates an object with props defined by `Fields` and includes a mandatory `type` field. 

4. **TypedFieldFactoryShallow:**  

- Similar to `TypedFieldFactory` but extends `IManagedShallow` with the properties of `TypedFieldFactory`. 

5. **Type Aliases for Specific Layouts and Fields:**  

- Types like `Group`, `Custom`, `Paper`, `Outline`, etc., are created by specifying the corresponding layout or field type and their props. 

6. **TypedFieldRegistry:**  

- This is a type-guard for determining the type of a field or layout. It uses conditional types to match the provided `Target` type to the appropriate layout or field type. 

7. **TypedField:**  

- This type represents a generic form field and can be one of the types defined in `TypedFieldRegistry`. 
- It includes optional properties like `name`, `fields` (an array of child fields), and `child` (a single child field). 

8. **Export:**  

- The `TypedField` type is exported as the default export of the module.

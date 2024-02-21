# `makeField` higher order component

> Link [to the source code](../../src/components/One/components/makeField/)

The `makeField` utility function is designed to enhance a given React component (`originalComponent`) with advanced form field management capabilities. This utility provides functionality for debouncing, validation, focus management, and more, making it a valuable tool for creating controlled and efficient form fields.

### Parameters

- `originalComponent` (React component): The base component to be enhanced. 
- `fieldConfig` (Object, optional): Configuration options for customizing the behavior of the enhanced form field.

### Configuration Options 

- `withApplyQueue` (boolean): Enables a queue for applying changes, useful for debouncing. Default is `false`. 
- `skipDebounce` (boolean): Skips debouncing for immediate change application. Default is `false`. 
- `skipDirtyClickListener` (boolean): Skips handling dirty state on click. Default is `false`. 
- `skipFocusReadonly` (boolean): Skips applying readonly state on focus. Default is `false`. 
- `defaultProps` (Object): Default properties to be applied to the enhanced form field component.

### Features 

1. **State and Context Management** : The utility manages state and context through custom hooks such as `useOneState`, `useOnePayload`, and `useOneMenu`. 
2. **Event Handling** : Sets up event listeners for various events, including click, touch, tab, and move. 
3. **Debouncing** : Manages debouncing of changes, with options to customize debounce speed. 
4. **Validation and Visibility** : Handles form field validation, visibility, and disabled/enabled states. 
5. **Dynamic Styling** : Dynamically applies CSS classes based on the state of the form field.

### Enhanced Component

The enhanced component, returned by `makeField`, includes the following properties: 
- `onChange`: Callback for handling form field changes. 
- `fallback`: Default callback in case of errors. 
- `disabled`: Current disabled state. 
- `readonly`: Current readonly state. 
- `dirty`: Current dirty state. 
- `autoFocus`: Auto-focus behavior. 
- `invalid`: Current validation status. 
- `incorrect`: Additional validation status. 
- `value`: Current field value. 
- `name`: Field name. 
- `loading`: Loading state. 
- `object`: Current object state. 
- `prefix`: Prefix for the field. 
- `outlinePaper`: Flag for outlining the paper. 
- `withContextMenu`: Flag for enabling context menu. 
- Other custom properties provided by the `originalComponent`.

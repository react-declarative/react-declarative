### `and`

The `and` function performs a logical AND operation on multiple values passed as arguments. Here's a simplified explanation: 
- It accepts any number of arguments of type `T`, defaulting to `Promise<Value>`.
- It checks if any of the arguments are Promises.
- If there are Promises, it waits for all to resolve and performs a logical AND operation on their values.
- If no Promises, it directly performs the logical AND operation.
- It returns a boolean value representing the result of the operation.

### `first`

The `first` function retrieves the first element of an array, if it exists, or returns null if the array is null, undefined, or empty.

### `join`

The `join` function combines multiple arrays into one, flattens nested arrays, removes null values, and eliminates duplicate entries. It returns an array containing unique, non-null values from all input arrays.

### `last`

The `last` function retrieves the last element of an array, if it exists, or returns null if the array is null, undefined, or empty.

### `match`

The `match` function behaves like an advanced `if` statement, allowing you to define values or functions for condition, consequent, and alternative path. It handles both synchronous and asynchronous operations, returning a value based on the condition.

### `not`

The `not` function applies the logical negation operator to the provided argument, handling both Promise and non-Promise values.

### `or`

The `or` function performs a logical OR operation on a set of provided arguments, handling both Promise and non-Promise values.

### `truely`

The `truely` function removes null elements from an array and returns the filtered array.

These functions provide various utilities for logical operations, array manipulation, and conditional processing, making code more expressive and efficient.

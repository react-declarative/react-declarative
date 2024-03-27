# useResolved

To resolve `handler` value the `<One />` component use `useResolved` hook. If `handler` is a function it will process as a one-way binding. If handler is assigned to `useState` value, it will refresh `<One />` form on a state change

## The Data Flow

- The data flow in this code can be described as follows: 

1. **Initialization** : 
- The hook initializes the `data` state variable using `useState`. This state variable represents the resolved data. 
- It also initializes several other variables and hooks like `isMounted`, `isRoot`, and various subjects for handling changes, reloads, and updates. 

2. **`handler` Prop Change** : 

The hook sets up an effect that triggers whenever the `handler` prop changes. 

Within this effect:

- It attempts to resolve data based on the `handler` function provided in the props. 
- If the `handler` is a function, it calls the function with the provided `payload` and updates the state with the result. 
- It also handles cases where the `handler` result is synchronous or asynchronous (a Promise).
- If an error occurs during resolution, it either invokes a fallback function (if provided) or throws the error.
- It subscribes to subjects for handling changes, reloads, and updates. 
- It updates the reference to the instance of the `IOneApi` interface. 

3. **Cleanup** : 
- It cleanup itself when the component is unmounted. 

4. **Return** :
- The hook returns a tuple containing the resolved data and a function to update the data.

In summary, the data flow involves initializing state, reacting to changes in the `handler` prop, resolving data based on the provided handler function, managing subscriptions to subjects, and cleaning up when the component is unmounted.

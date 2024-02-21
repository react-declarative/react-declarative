# OneGenesis

> Link [to the source code](../../src/components/One/components/OneGenesis/)

In the `OneGenesis` component, recursion starts within the `OneInternal` component. The `OneInternal` component is responsible for rendering the individual fields and layouts within the form. This recursive rendering allows for the creation of nested structures in the form, such as groups of fields or layouts within layouts.

Here's how the recursion works: 

1. **Initialization:**  
- The `OneGenesis` component initializes the rendering process by rendering the `OneInternal` component within its JSX structure. 

2. **Iterating Over Fields:**  

- Inside the `OneInternal` component, there is a mapping over the provided `fields` prop. 
- For each field in the array, the `createField` or `createLayout` function is called, depending on whether the field is a layout or a regular field. 

3. **Recursive Call:**  

- If the field is a layout (based on its `type`), the `createLayout` function is invoked, and the `OneInternal` component is recursively called with the child layout as its argument.
- This recursive call continues down the hierarchy of layouts and fields until all nested structures are processed. 

4. **Rendering Leaf Fields:**  

- When a leaf field (a field without nested structures) is encountered, the `createField` function is called, and the rendering process stops for that branch of recursion. 

5. **Memoization:**  

- To optimize performance, the `memo` function is applied to the `OneInternal` component, preventing unnecessary re-renders of the same configuration.

This recursive approach allows for the dynamic rendering of complex form structures, supporting nested groups and layouts. The recursion terminates when it reaches the leaf fields, and the form is rendered accordingly. The use of memoization ensures that previously rendered structures are not recalculated, contributing to better performance.

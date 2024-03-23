# IResult

Represents a result object with a total property and push, pop, and clear methods.

## Properties

### total

```ts
total: number
```

### push

```ts
push: (modal: IModal) => void
```

Pushes a modal onto the stack.

### pop

```ts
pop: () => void
```

Removes the last element from an array and returns undefined.

### clear

```ts
clear: () => void
```

Clears the modal stack.

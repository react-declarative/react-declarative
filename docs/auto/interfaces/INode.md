# INode

Represents a Node in a tree structure.

## Properties

### label

```ts
label: string
```

### value

```ts
value: string
```

### child

```ts
child: Omit<INode, "child">[]
```

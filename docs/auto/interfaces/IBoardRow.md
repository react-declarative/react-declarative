# IBoardRow

Represents a row in a board with data and payload.

## Properties

### label

```ts
label: ReactNode
```

### value

```ts
value: (id: string, data: Data, payload: Payload) => ReactNode | Promise<ReactNode>
```

### visible

```ts
visible: boolean | ((id: string, data: Data, payload: Payload) => boolean | Promise<boolean>)
```

### click

```ts
click: (id: string, data: Data, payload: Payload) => void | Promise<void>
```

# ICardViewProps

Represents the properties for the CardView component.

## Properties

### handler

```ts
handler: ItemData[] | ((search: string, skip: number) => ItemData[] | Promise<ItemData[]>)
```

### scrollXSubject

```ts
scrollXSubject: TSubject<number>
```

### scrollYSubject

```ts
scrollYSubject: TSubject<number>
```

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

### cardActions

```ts
cardActions: ICardViewAction<ItemData, Payload>[]
```

### operations

```ts
operations: ICardViewOperation<ItemData, Payload>[]
```

### payload

```ts
payload: Payload | (() => Payload)
```

### formatMedia

```ts
formatMedia: (item: ItemData) => React.ReactNode
```

### formatCardLabel

```ts
formatCardLabel: (item: ItemData) => React.ReactNode
```

### formatKey

```ts
formatKey: (key: keyof ItemData) => React.ReactNode
```

### formatValue

```ts
formatValue: (key: keyof ItemData, value: ItemData[keyof ItemData]) => React.ReactNode
```

### onOperation

```ts
onOperation: (operation: string, selectedItems: ItemData[], isAllSelected: boolean) => void | Promise<void>
```

### onAction

```ts
onAction: (action: string, item: ItemData) => void
```

### onCardClick

```ts
onCardClick: (item: ItemData) => void
```

### onLoadStart

```ts
onLoadStart: () => void
```

### pickFields

```ts
pickFields: (keyof ItemData)[]
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### fallback

```ts
fallback: (e: Error) => void
```

### skipStep

```ts
skipStep: number
```

### throwError

```ts
throwError: boolean
```

### noSearch

```ts
noSearch: boolean
```

### noFooter

```ts
noFooter: boolean
```

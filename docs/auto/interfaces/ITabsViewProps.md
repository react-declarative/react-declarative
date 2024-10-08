# ITabsViewProps

Represents the props for the ITabsView component.

## Properties

### fullScreen

```ts
fullScreen: boolean
```

### transparentHeader

```ts
transparentHeader: boolean
```

### BeforeTabs

```ts
BeforeTabs: React.ComponentType<{ payload: Payload; history: History; activeTab: ITabsStep<Payload>; }>
```

### AfterTabs

```ts
AfterTabs: React.ComponentType<{ payload: Payload; history: History; activeTab: ITabsStep<Payload>; }>
```

### className

```ts
className: string
```

### outlinePaper

```ts
outlinePaper: boolean
```

### transparentPaper

```ts
transparentPaper: boolean
```

### style

```ts
style: React.CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

The system prop that allows defining system overrides as well as additional CSS styles.
The system prop that allows defining system overrides as well as additional CSS styles.

### onTabChange

```ts
onTabChange: (id: string, history: MemoryHistory, payload: Payload) => void
```

### routes

```ts
routes: ITabsOutlet<Data, Payload>[]
```

### tabs

```ts
tabs: ITabsStep<Payload>[]
```

### history

```ts
history: History
```

### pathname

```ts
pathname: string
```

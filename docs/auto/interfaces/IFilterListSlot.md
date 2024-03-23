# IFilterListSlot

Represents a filter list slot.

## Properties

### className

```ts
className: string
```

### filterData

```ts
filterData: FilterData
```

### style

```ts
style: CSSProperties
```

### filters

```ts
filters: IField<FilterData, any>[]
```

### change

```ts
change: (data: FilterData) => void
```

### onSearchChange

```ts
onSearchChange: (search: string) => void
```

### onFilterChange

```ts
onFilterChange: (data: FilterData) => void
```

Function signature for the onFilterChange event callback.

### onCollapsedChange

```ts
onCollapsedChange: (collapsed: boolean) => void
```

Callback function called when the collapsed state changes.

### withToggledFilters

```ts
withToggledFilters: boolean
```

### ready

```ts
ready: () => void
```

### clean

```ts
clean: () => void
```

### loading

```ts
loading: boolean
```

### label

```ts
label: string
```

### search

```ts
search: string
```

### withSearch

```ts
withSearch: boolean
```

### height

```ts
height: number
```

### width

```ts
width: number
```

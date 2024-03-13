# IMasterDetailProps

Props interface for the IMasterDetail component.

## Properties

### withTransparentTabs

```ts
withTransparentTabs: boolean
```

### withMenuCollapse

```ts
withMenuCollapse: boolean
```

### withFixedPos

```ts
withFixedPos: boolean
```

### fixedPosHeaderAdjust

```ts
fixedPosHeaderAdjust: number
```

### mode

```ts
mode: MasterDetailMode
```

### title

```ts
title: string
```

### children

```ts
children: React.ReactNode
```

### Loader

```ts
Loader: React.ComponentType<any>
```

### Error

```ts
Error: React.ComponentType<any>
```

### activeOption

```ts
activeOption: string
```

### onActiveOptionChange

```ts
onActiveOptionChange: (activeOption: string, initial: boolean) => void
```

### className

```ts
className: string
```

### style

```ts
style: React.CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

### payload

```ts
payload: Payload
```

### deps

```ts
deps: any[]
```

### options

```ts
options: IMasterDetailOption<Payload>[]
```

### fallback

```ts
fallback: (e: Error) => void
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### throwError

```ts
throwError: boolean
```

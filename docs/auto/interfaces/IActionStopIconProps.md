# IActionStopIconProps

Represents the properties for the ActionStopIcon component. This class extends the IconButtonProps interface and adds additional properties.

## Properties

### children

```ts
children: ReactNode
```

The icon to display.
The content of the component.

### sx

```ts
sx: SxProps<any>
```

### className

```ts
className: string
```

### style

```ts
style: CSSProperties
```

### noProgress

```ts
noProgress: boolean
```

### disabled

```ts
disabled: boolean
```

If `true`, the component is disabled.

### size

```ts
size: number
```

### thickness

```ts
thickness: number
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### onClick

```ts
onClick: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>
```

### fallback

```ts
fallback: (e: Error) => void
```

### throwError

```ts
throwError: boolean
```

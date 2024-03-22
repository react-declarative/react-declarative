# IWizardNavigationProps

Interface for the properties of the Wizard Navigation component.

## Properties

### className

```ts
className: string
```

### style

```ts
style: CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

The system prop that allows defining system overrides as well as additional CSS styles.

### disabled

```ts
disabled: boolean
```

### AfterPrev

```ts
AfterPrev: ComponentType<any>
```

### BeforeNext

```ts
BeforeNext: ComponentType<any>
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

### hasPrev

```ts
hasPrev: boolean
```

### hasNext

```ts
hasNext: boolean
```

### labelPrev

```ts
labelPrev: string
```

### labelNext

```ts
labelNext: string
```

### onPrev

```ts
onPrev: () => void | Promise<void>
```

### onNext

```ts
onNext: () => void | Promise<void>
```

### throwError

```ts
throwError: boolean
```

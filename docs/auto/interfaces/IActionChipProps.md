# IActionChipProps

Interface representing the props for the ActionChip component.

## Properties

### withSingleValue

```ts
withSingleValue: boolean
```

### value

```ts
value: boolean
```

### onChange

```ts
onChange: (value: boolean) => boolean | void | Promise<boolean | void>
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### fallback

```ts
fallback: (e: Error) => void
```

### throwError

```ts
throwError: boolean
```

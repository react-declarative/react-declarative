# IActionButtonProps

Represents the properties for an ActionButton component.

## Properties

### Progress

```ts
Progress: ({ loading, children, }: { children: ReactNode; loading: boolean; }) => Element
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

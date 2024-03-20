# ISwitchItem

Represents an item in a switch component.

## Properties

### path

```ts
path: string
```

### element

```ts
element: ComponentType<any>
```

### guard

```ts
guard: () => boolean | Promise<boolean>
```

### prefetch

```ts
prefetch: (params: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>
```

### unload

```ts
unload: (params: Record<string, any>) => void | Promise<void>
```

### redirect

```ts
redirect: string | ((params: Record<string, any>) => string)
```

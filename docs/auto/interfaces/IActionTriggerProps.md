# IActionTriggerProps

Interface representing the properties of an action trigger component.

## Properties

### actions

```ts
actions: IActionTrigger<any>[]
```

### onAction

```ts
onAction: (action: string) => void | Promise<void>
```

### variant

```ts
variant: OverridableStringUnion<"text" | "outlined" | "contained", ButtonPropsVariantOverrides>
```

### size

```ts
size: OverridableStringUnion<"small" | "medium" | "large", ButtonPropsSizeOverrides>
```

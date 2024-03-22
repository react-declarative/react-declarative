# IWaitViewProps

Interface representing the props for the WaitView component.

## Properties

### Content

```ts
Content: ComponentType<any>
```

### condition

```ts
condition: () => boolean | Promise<boolean> | T | Promise<T> | Promise<null>
```

### conditionMap

```ts
conditionMap: (result: T) => boolean
```

### onDone

```ts
onDone: (attempts: number) => void
```

### totalAttempts

```ts
totalAttempts: number
```

### delay

```ts
delay: number
```

# IConditionLayoutProps

## Properties

### condition

```ts
condition: ((data: Data, payload: Payload) => boolean) | ((data: Data, payload: Payload) => Promise<boolean>)
```

### shouldCondition

```ts
shouldCondition: (prevData: Data, nextData: Data, payload: Payload) => boolean
```

### conditionLoading

```ts
conditionLoading: ComponentType<{ data: Data; payload: Payload; }>
```

### conditionElse

```ts
conditionElse: ComponentType<{ data: Data; payload: Payload; }>
```

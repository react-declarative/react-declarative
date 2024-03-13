# Operator

## Constructor

```ts
constructor();
```

## Properties

### take

```ts
take: <T = any>(count: number) => (target: any) => any
```

### skip

```ts
skip: <T = any>(the: number) => (target: any) => any
```

### pair

```ts
pair: <T = any>(by?: number) => (target: any) => any
```

### group

```ts
group: <T = any>(by: number) => (target: any) => any
```

### strideTricks

```ts
strideTricks: <T = any>(strideSize: number, step?: number) => (target: any) => any
```

### distinct

```ts
distinct: <T = any, V = any>(getCompareValue?: (value: T) => V) => (target: any) => any
```

### liveness

```ts
liveness: <T = any>(fallbackfn: () => void, waitFor?: number) => (target: any) => any
```

### count

```ts
count: <T = any>() => (target: any) => any
```

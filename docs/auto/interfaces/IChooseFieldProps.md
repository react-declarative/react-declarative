# IChooseFieldProps

Props for the IChooseField component.

## Properties

### description

```ts
description: string
```

### outlined

```ts
outlined: boolean
```

### title

```ts
title: string
```

### placeholder

```ts
placeholder: string
```

### labelShrink

```ts
labelShrink: boolean
```

### readonly

```ts
readonly: boolean
```

### disabled

```ts
disabled: boolean
```

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```

### inputRef

```ts
inputRef: (element?: HTMLInputElement) => void
```

### choose

```ts
choose: (data: Data, payload: Payload) => string | string[] | Promise<string | string[]>
```

### tr

```ts
tr: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>)
```

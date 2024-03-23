# IChooseFieldProps

Props for the IChooseField component.

## Properties

### description

```ts
description: string
```

Retrieves the "description" property from the given object.

### outlined

```ts
outlined: boolean
```

Type definition for the `PickProp` function.

### title

```ts
title: string
```

Type definition for the `title` property when using `PickProp` utility.

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

Type definition for the 'choose' property of IField.

### tr

```ts
tr: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>)
```

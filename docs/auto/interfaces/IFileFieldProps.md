# IFileFieldProps

Interface representing props for the IFileField component.

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

### fileAccept

```ts
fileAccept: string
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

### labelShrink

```ts
labelShrink: boolean
```

### upload

```ts
upload: (file: File, data: Data, payload: Payload) => string | Promise<string>
```

### view

```ts
view: (file: string, data: Data, payload: Payload) => void | Promise<void>
```

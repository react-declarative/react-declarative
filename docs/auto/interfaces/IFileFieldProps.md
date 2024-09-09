# IFileFieldProps

Interface representing props for the IFileField component.

## Properties

### validation

```ts
validation: IValidation
```

Validation factory config

### description

```ts
description: string
```

Type definition for the `PickProp` function.
Extracts a specific property `description` from a given object type `IField&lt;Data, Payload&gt;`.
Type definition for the `PickProp` function.
Extracts a specific property `description` from a given object type `IField&lt;Data, Payload&gt;`.

### outlined

```ts
outlined: boolean
```

Picks the "outlined" property from a given object type.

### title

```ts
title: string
```

Type definition for the 'title' property of the PickProp utility.

### placeholder

```ts
placeholder: string
```

Type definition for the placeholder property of a field.

### fileAccept

```ts
fileAccept: string
```

### readonly

```ts
readonly: boolean
```

Retrieves the value of the "readonly" property from the provided object.

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

This variable represents a property 'view' extracted from an object of type PickProp&lt;IField&lt;Data, Payload&gt;, 'view'&gt;.
The 'view' property is used to specify a specific view for processing fields.
This variable represents a property 'view' extracted from an object of type PickProp&lt;IField<Data, Payload&gt;, 'view'>.
The 'view' property is used to specify a specific view for processing fields.

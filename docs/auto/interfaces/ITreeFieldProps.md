# ITreeFieldProps

Interface for the props of the ITreeField component.

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

Returns the "description" property of a given object.

### outlined

```ts
outlined: boolean
```

Type declaration for the PickProp utility function.

### title

```ts
title: string
```

Type definition for the "title" property picked from the given object type.

### placeholder

```ts
placeholder: string
```

### readonly

```ts
readonly: boolean
```

Specifies if a field is readOnly.

### disabled

```ts
disabled: boolean
```

### itemTree

```ts
itemTree: ITreeNode[] | ((data: Data, payload: Payload) => ITreeNode[]) | ((data: Data, payload: Payload) => Promise<ITreeNode[]>)
```

# IPhonyField

Represents a phony field interface with additional properties.
 - Phony fields are not serializable, so they will not affect form data
 - Phony fields are reflectable, `getAvailableFields()` and `&lt;VisibilityView /&gt;` will detect them.

## Properties

### title

```ts
title: string
```

### description

```ts
description: string
```

### placeholder

```ts
placeholder: string
```

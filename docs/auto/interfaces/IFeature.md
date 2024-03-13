# IFeature

Represents a feature.

## Properties

### type

```ts
type: FeatureType
```

### name

```ts
name: string
```

### label

```ts
label: string
```

### description

```ts
description: string
```

### defaultValue

```ts
defaultValue: string | boolean
```

### isDisabled

```ts
isDisabled: (v: Data, payload: Payload) => boolean
```

### isVisible

```ts
isVisible: (v: Data, payload: Payload) => boolean
```

### map

```ts
map: (data: Data, payload: Payload) => Data
```

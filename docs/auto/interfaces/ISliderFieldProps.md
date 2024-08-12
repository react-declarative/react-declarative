# ISliderFieldProps

Interface representing the properties of a Slider Field component.

## Properties

### stepSlider

```ts
stepSlider: number
```

### maxSlider

```ts
maxSlider: number
```

### minSlider

```ts
minSlider: number
```

The minimum value for a slider in a field.

### labelFormatSlider

```ts
labelFormatSlider: (v: number) => string | number
```

### leadingIconRipple

```ts
leadingIconRipple: boolean
```

Retrieve the value of the 'leadingIconRipple' property from a given object.

### trailingIconRipple

```ts
trailingIconRipple: boolean
```

### leadingIcon

```ts
leadingIcon: ComponentType<any>
```

### trailingIcon

```ts
trailingIcon: ComponentType<any>
```

Sets the trailing icon of the field.

### leadingIconClick

```ts
leadingIconClick: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void
```

### trailingIconClick

```ts
trailingIconClick: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void
```

### sliderThumbColor

```ts
sliderThumbColor: (v: number) => string
```

### sliderTrackColor

```ts
sliderTrackColor: (v: number) => string
```

The color of the slider track.

### sliderRailColor

```ts
sliderRailColor: (v: number) => string
```

Retrieves the value of the `sliderRailColor` property from the given object.

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```

### readonly

```ts
readonly: boolean
```

Retrieves the `readonly` property value from the provided object.

### disabled

```ts
disabled: boolean
```

### leadingIconTabIndex

```ts
leadingIconTabIndex: number
```

### trailingIconTabIndex

```ts
trailingIconTabIndex: number
```

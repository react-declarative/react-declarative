# BoxProps

```ts
type BoxProps = Omit<MatBoxProps, keyof {
    onChange: never;
}>;
```

Represents the properties for a Box component.
Extends the MatBoxProps and removes the 'onChange' property.

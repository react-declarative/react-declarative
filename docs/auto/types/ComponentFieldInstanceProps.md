# ComponentFieldInstanceProps

```ts
export type ComponentFieldInstanceProps = Omit<ComponentFieldInstance, keyof {
    context: never;
}> & {
    Element: React.ComponentType<ComponentFieldInstance>;
};
```

Represents the props for a specific instance of a component field.

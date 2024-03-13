# TypedFieldFactory

```ts
type TypedFieldFactory<Type extends FieldType, Fields extends {}, Data = IAnything, Payload = IAnything> = {
    [Prop in keyof Omit<Fields, keyof Exclude<Data, Payload>>]?: Fields[Prop];
} & {
    type: Type;
};
```

A factory class for creating typed fields.

# TypedField

```ts
export type TypedField<Data = IAnything, Payload = IAnything> = TypedFieldRegistry<Data, Payload> & {
    name?: string;
    fields?: TypedField<Data, Payload>[];
    child?: TypedField<Data, Payload>;
};
```

IOneProps - генерик, для прикладного программиста мы можем подменить IField
на TypedField.  Это  позволит  автоматически  выбрать  интерфейс  props для
IntelliSense после указания *type* или методом исключения

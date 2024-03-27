# OneContextProvider

> Obsolete

OneContextProvider provides a mutable context to form component fields with change detection. For example

1. Provide getter function of entity in payload (fetch)
2. Pass id of entity to context property
3. The `FieldType.Component` field will trigger <Async /> component refresh on context change skipping field validation and visibility

The `<Async />` component is [documented here](../../README.md#async-pipe-port)


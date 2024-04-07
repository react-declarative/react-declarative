# Exclude

```ts
type Exclude<Data = IAnything> = {
    object: never;
    type: never;
    focus: never;
    blur: never;
    click: never;
    ready: never;
    check: never;
    change: never;
    name: never;
    menu: never;
    map: never;
    menuItems: never;
    readTransform: never;
    writeTransform: never;
} & IManagedShallow<Data>;
```

Свойства, не доступные управляемому полю

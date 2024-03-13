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
    menuItems: never;
} & IManagedShallow<Data>;
```

Свойства, не доступные управляемому полю

# Group

```ts
type Group<Data = IAnything> = Omit<IGroupProps<Data>, keyof {
    fieldRightMargin: never;
    fieldBottomMargin: never;
}>;
```



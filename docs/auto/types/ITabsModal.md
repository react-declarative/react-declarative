# ITabsModal

```ts
export type ITabsModal<Data = IAnything, Payload = IAnything> = Omit<ITabsOutlet<Data, Payload>, keyof {
    element: never;
}> & {
    element: (props: ITabsModalProps<Data, Payload>) => React.ReactElement;
};
```

Represents a class ITabsModal.

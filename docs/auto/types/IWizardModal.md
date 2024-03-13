# IWizardModal

```ts
export type IWizardModal<Data = IAnything, Payload = IAnything> = Omit<IWizardOutlet<Data, Payload>, keyof {
    element: never;
}> & {
    element: (props: IWizardModalProps<Data, Payload>) => React.ReactElement;
};
```

Represents a modal wizard with specific data and payload types.

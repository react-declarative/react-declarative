# ITreeViewProps

```ts
type ITreeViewProps = {
    value?: string[] | null;
    readOnly?: boolean;
    loading?: boolean;
    items: INode[];
    onChange?: (value: string[] | null) => void;
} & Omit<TextFieldProps, keyof {
    onChange: never;
}>;
```



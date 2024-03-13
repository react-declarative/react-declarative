# ComponentFieldInstance

```ts
export type ComponentFieldInstance<Data = any, Payload = any> = Data & {
    onChange: (data: Partial<Data>) => void;
    _fieldData: Data;
    _fieldParams: IField;
    context: Record<string, any>;
    outlinePaper: boolean;
    transparentPaper: boolean;
    payload: Payload;
    disabled: boolean;
    readonly: boolean;
    features: string[];
};
```

Represents parameters for a component field element callback.

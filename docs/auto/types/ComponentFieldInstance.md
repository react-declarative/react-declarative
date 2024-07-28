# ComponentFieldInstance

```ts
export type ComponentFieldInstance<Data = any, Payload = any> = Data & {
    onChange: (data: Partial<Data>) => void;
    onValueChange: IManaged<Data, Payload>["onChange"];
    _fieldData: Data;
    _fieldParams: IField;
    context: Record<string, any>;
    outlinePaper: boolean;
    transparentPaper: boolean;
    payload: Payload;
    disabled: boolean;
    readonly: boolean;
    incorrect: IManaged<Data, Payload>["incorrect"];
    invalid: IManaged<Data, Payload>["invalid"];
    value: IManaged<Data, Payload>["value"];
    features: string[];
};
```

Represents parameters for a component field element callback.

# ICustomLayoutProps

## Properties

### className

```ts
className: string
```

### style

```ts
style: CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

### customLayout

```ts
customLayout: (props: PropsWithChildren<Data & { onChange: (data: Partial<Data>) => void; _fieldData: Data; _fieldParams: IField<any, any>; _payload: Payload; }>) => ReactElement<...>
```

### hidden

```ts
hidden: boolean | ((payload: Payload) => boolean)
```

# makeField

```ts
export function makeField(originalComponent: React.FC<IManaged>, fieldConfig?: IConfig): {
    <Data extends unknown = any>({ className, sx, columns, phoneColumns, tabletColumns, desktopColumns, isDisabled: isDisabledUpper, isVisible: isVisibleUpper, isInvalid: isInvalidUpper, isIncorrect: isIncorrectUpper, isReadonly: isReadonlyUpper, change, fallback, ready, compute: upperCompute, shouldRecompute, click, map, object: upperObject, name, title, menu, debug, focus, blur, invalidity, prefix, dirty: upperDirty, disabled: fieldDisabled, readonly: upperReadonly, autoFocus, style, menuItems, groupRef: ref, fieldRightMargin, fieldBottomMargin, outlinePaper, transparentPaper, ...otherProps }: IEntity<Data, any>): JSX.Element | null;
    displayName: string;
};
```

- Оборачивает IEntity в удобную абстракцию IManaged, где сразу
  представлены invalid, disabled, visible и можно задваивать вызов onChange
- Управляет фокусировкой, мануально ожидая потерю фокуса, эмулируя onBlur

## Parameters

| Parameter | Description |
|-----------|-------------|
| `originalComponent` | |
| `fieldConfig` | |

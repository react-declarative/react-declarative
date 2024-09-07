# IManaged

Свойства сущности, обернутой в компонент высшего порядка
Предоставляется удобная абстракция

## Properties

### name

```ts
name: string
```

### value

```ts
value: Value
```

### dirty

```ts
dirty: boolean
```

### withContextMenu

```ts
withContextMenu: true
```

### disabled

```ts
disabled: boolean
```

### loading

```ts
loading: boolean
```

### readonly

```ts
readonly: boolean
```

Флаг только на чтение и "круглой окаймовки"
Флаг только на чтение и "круглой окаймовки"

### fieldReadonly

```ts
fieldReadonly: boolean
```

### incorrect

```ts
incorrect: string
```

### invalid

```ts
invalid: string
```

### object

```ts
object: Data
```

### click

```ts
click: (e: MouseEvent<any, MouseEvent>) => void | Promise<void>
```

### onChange

```ts
onChange: (v: Value, config?: { skipReadonly?: boolean; }) => void
```

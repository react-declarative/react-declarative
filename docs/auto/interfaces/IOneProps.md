# IOneProps

Properties of the &lt;One /&gt; template engine component

## Properties

### baseline

```ts
baseline: boolean
```

Привязывет поля к нижнему краю

### noBaseline

```ts
noBaseline: boolean
```

Привязывает поля и компоновки к верхнему краю

### apiRef

```ts
apiRef: React.Ref<IOneApi<any>>
```

Ссылка на объект API

### context

```ts
context: Record<string, any>
```

Контекст кастомных полей, в отличие от
payload доступен к change detection

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

Эмиттер для запроса данных

### withNamedPlaceholders

```ts
withNamedPlaceholders: boolean
```

Генерирует плейсхолдеры согласно схеме полей целевого объекта

### changeSubject

```ts
changeSubject: TSubject<Data>
```

Эмиттер для перезаписи данных. Вызывает change(data, true)

### updateSubject

```ts
updateSubject: TSubject<Data>
```

Эмиттер для изменения данных. Вызывает change(data, false)

### isBaseline

```ts
isBaseline: (field: IField<any, any>) => boolean
```

Функция, определяющая, нужно ли включить baseline зависимо от
расположения поля в иерархии композиции потомков

### isBaselineForRoot

```ts
isBaselineForRoot: (field: IField<any, any>) => boolean
```

Корневой компонент привязывает поля к нижнему краю только если
нет ни одной компоновки

### createField

```ts
createField: (entity: IEntity<Data, any>, currentPath: string) => React.ReactElement
```

Фабрика для создания полей пользователя

### createLayout

```ts
createLayout: (entity: IEntity<Data, any>, children: React.ReactNode, currentPath: string) => React.ReactElement
```

Фабрика для создания компоновок пользователя

### className

```ts
className: string
```

Класс корневой группы

### dirty

```ts
dirty: boolean
```

Если флаг включен, показываем валидацию до фокусировки по полю

### features

```ts
features: string[]
```

Список бизнес-функций, ограничивающий отображение полей

### style

```ts
style: React.CSSProperties
```

Стиль корневой группы

### sx

```ts
sx: SxProps<any>
```

SX для корневой группы

### handler

```ts
handler: OneHandler<Data, Payload>
```

Позволяет загружать данные в компонент

### payload

```ts
payload: Payload | (() => Payload)
```

Объект, передающийся в пользовательские
поля через контекст

### fallback

```ts
fallback: (e: Error) => void
```

Вызывается при ошибке в handler

### invalidity

```ts
invalidity: (name: string, msg: string, payload: Payload) => void
```

Коллбек, вызываемый при не прохождении
валидации

### focus

```ts
focus: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

Вызываются при фокусировки по филду
в компоненте и потере фокуса

### blur

```ts
blur: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### readTransform

```ts
readTransform: (value: Value, name: string, data: Data, payload: Payload) => Value
```

crypt/decrypt значения, получаемого в `makeField` из
управляемого объекта

### writeTransform

```ts
writeTransform: (value: Value, name: string, data: Data, payload: Payload) => Value
```

### menu

```ts
menu: (name: string, action: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

Коллбек для управления контекстным меню

### click

```ts
click: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void, e: React.MouseEvent) => void | Promise<void>
```

Коллбек для перехвата клика по полю

### ready

```ts
ready: () => void
```

Вызывается, когда все поля успели отрисоваться
в первый раз, после появления формы

### change

```ts
change: (Data: Data, initial: boolean) => void
```

Вызывается после изменения и передает измененный
объект прикладному программисту

### fields

```ts
fields: Field[]
```

Массив полей, выводимый в компоненте

### prefix

```ts
prefix: string
```

Префикс для формирования ключей элементов

### loadStart

```ts
loadStart: (source: string) => void
```

Коллбеки управления отображением
состоянием загрузки

### loadEnd

```ts
loadEnd: (isOk: boolean, source: string) => void
```

### outlinePaper

```ts
outlinePaper: boolean
```

Превращает FieldType.Paper в FieldType.Outline

### transparentPaper

```ts
transparentPaper: boolean
```

### readonly

```ts
readonly: boolean
```

Блокирует ввод данных

### disabled

```ts
disabled: boolean
```

Отключает поля ввода

### slots

```ts
slots: Partial<ISlotFactoryContext>
```

Слоты для полей ввода

### fieldDebounce

```ts
fieldDebounce: number
```

Debounce для FieldType.Text

# Компонент `List`

>  Компонент списочной формы для удобного отображения каких-либо данных и взаимодействия с ними. Настроена пагинация и разметка.

## Основные свойства компонента: 

### 1. filters

Элемент фильтров, который находится непосредственно над самим списком. Принимает в себя массив типа `TypedField[]` или `IField`. 

```tsx
{
    type: FieldType.Text,
    name: 'firstName',
    title: 'First name',
},
{
    type: FieldType.Text,
    name: 'lastName',
    title: 'Last name',
}
```

### 2. columns

Отвечает за колонки списка. Это должен быть массив типа `IColumn[]`. Определяет тип, название и свойства колонки(например ширину). Основные типы колонок: `ColumnType.Text`, `ColumnType.Compute`, `ColumnType.Component`, `ColumnType.CheckBox`, `ColumnType.Action` 

```tsx
{
    type: ColumnType.Text,
    field: 'name',
    headerName: 'Name',
    width: '200px',
},
{
    type: ColumnType.Component,
    field: 'countryFlag',
    headerName: 'Country',
    width: '20vw',
    element: (props) => <CountryFlag {...props} />,
},
{
    type: ColumnType.Compute,
    field: 'name',
    headerName: 'Name',
    width: 'max(15vw, 100px)',
    compute: ({ firstName, lastName }) => `${firstName} ${lastName}`,  
},
```

### 3. actions

Создает кнопку в верхнем правом углу списка с выпадающим меню опций, где перечислены возможные действия со списком или его отдельными элементами (например, создание нового пользователя). При этом логика действий тут не прописывается. Массив типа `IListAction[]`.

```tsx
{
    type: ActionType.Menu,
    options: [
        {
            action: 'create',
            label: 'Create a new person',
        },
        {
            action: 'delete',
            label: 'Delete',
        },
    ]
},
```

### 4. rowActions

То же самое, что `actions`, только в каждом отдельной строке. 

```tsx
{
    label: 'Remove this person',
    action: 'remove-action',
},
```

### 5. title

Название списка...

### 6. filterLabel

Название элемента с фильтрами...

### 7. handler

Функция, которая загружает данные в список, аналогична One.

### 8. onRowClick

Функция, которая вызывается при нажатии на какой-либо элемент списка (ряд).

### 9. onRowAction

Функция, которая вызывается в `rowActions`.

### 10. onAction

Функция, которая вызывается в `actions`.

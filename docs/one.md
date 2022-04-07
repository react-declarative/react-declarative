# Компонент `One`

> One это компонет библиотеки `react-declarative`, который представляет собой форму с различными полями (fields, текстовые, картинки, рейтинг и тп) и грид разметкой, которая позволяет удобно хранить, создавать, изменять данные, например, профиля какого-либо пользователя.

## Основные свойства компонента: 

### 1. fields

Основное, с чем приходится работать. Тут перечисляются поля, которые должны быть в форме. Задается через переменную `fields` (массив) c типом 'TypedField[]'. 
Пример:

```tsx
const fields: typedField[] = [
{
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Rating,
        columns: "2",
        phoneColumns: '12',
        fieldBottomMargin: "0",
        name: "rating",
        defaultValue: 3
      },
      {
        type: FieldType.Group,
        columns: "10",
        phoneColumns: '12',
        fields: [
          {
            name: 'lastName',
            type: FieldType.Text,
            title: 'Last name',
            description: 'Required',
          },
          {
            type: FieldType.Combo,
            title: "Gender",
            placeholder: "Choose your gender",
            name: "gender",
            itemList: [
              "Male",
              "Female",
            ]
          },
        ]
      }   
    ]  
}] 

export const examplePage = () => (
  <One
    fields={fields}
  /> 
);
```


Имеются следющие основные свойства:

**type** - задается тип поля. Например, `type: FieldType.Group`. Всего есть 22 типа полей.

**columns** - используется для разметки, значение string от 1 до 12, где 12 - вся ширина. (по логике грид)

**desctopColumns, tabletColumns и phoneColumns** - используются для настройки разметки на компьютере, плашете и смартфоне соответствено.

У каждого типа поля есть свои свойства, такие как: name, `title`, `fieldBottomMargin`, `outlined`, `defaultValue` и др.

`itemList` может быть асинхронным.

Для того, чтобы вставить в `fields` отдельный компонент используется `type: FieldType.Component`, где в свойстве `element` прописывается 
желаемый компонент, например: 

```tsx
{
    type: FieldType.Component,
    element: () => (
        <div> Exmaple </div>
    ),
}
```

### 2. handler

В нем должна быть функция (может вернуть промис) или ссылка на состояние компонента. Нужен для связи компонента с сервером или моковыми данными. Кстати, через композицию контекста переменных можно достучаться до `id` из роута.

### 3. fallback

Обратный вызов на случай ошибки в `handler`.

### 4. onChange
    
Функция, которая срабатывает при изменении данных в форме <One/>. Например, при изменении имени пользователя.

## Как работают `columns` в разметке?

> `columns` отвечают за разметку. Работает по логике grid. Отвечает за то, какое пространство по ширене будет занимать определенный элемент. Самое большое значение - '12' (`columns` имеет тип `string`) - что означет всю ширину. Значение "6" - будет означать половину ширины, "4" - 1/3 ширины "3" - 1/4 и так далее. P.s.: под шириной имеется ввиду ширина родителя.
Дефолтное значение - "12".

Например: 

```tsx
...
{
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Rating,
        columns: "2",
        desctopColumns: '2',
        tabletColumns: '2',
        phoneColumns: '12',
        fieldBottomMargin: "0",
        fieldBottomMargin: "0",
        name: "rating",
        defaultValue: 3
      },
      {
        type: FieldType.Group,
        columns: "10",
        desctopColumns: '10',
        tabletColumns: '10',
        phoneColumns: '12',
        fields: [
          {
            name: 'name',
            type: FieldType.Text,
            title: 'Name',
          }
        ]
      }
    ]
}
...         
...          
```
Т.е. элемент Rating будет занимать 20% ширины, а второй элемет Group - 80% ширины.

**desctopColumns** - используются для разметки на компьютере;

**tabletColumns** - используются для разметки на планшете;

**phoneColumns** - используются для разметки на смартфоне;

Можно настроить `margin` снизу и справа используя `fieldBottomMargin` и `fieldRightMargin` соответственно.
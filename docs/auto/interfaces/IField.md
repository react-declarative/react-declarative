# IField

Объект поля для прикладного программиста

## Properties

### icon

```ts
icon: ComponentType<any>
```

Иконка для FieldType.Button и FieldType.Icon

### iconSize

```ts
iconSize: number
```

Размер иконки для FieldType.Icon

### iconColor

```ts
iconColor: "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
```

Цвет иконки для FieldType.Icon

### iconBackground

```ts
iconBackground: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
```

Цвет фона иконки для FieldType.Icon

### buttonVariant

```ts
buttonVariant: "text" | "outlined" | "contained"
```

Тип заливки кнопки для FieldType.Button

### buttonSize

```ts
buttonSize: "small" | "medium" | "large"
```

Тип размера кнопки для FieldType.Button

### buttonColor

```ts
buttonColor: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
```

Тип цвета кнопки для FieldType.Button

### dirty

```ts
dirty: boolean
```

Отменяет ожидание фокуса для валидации

### validation

```ts
validation: IValidation
```

Параметры фабрики для создания коллбека isInvalid

### testId

```ts
testId: string
```

Атрибут, который будет передат в data-testid
корневому элементу компоновки

### name

```ts
name: string
```

Общие поля. Поле name позволяет задать забор
поля из целевого объекта, не нужен для group,
expansion и line.

### debug

```ts
debug: (params: IDebug<Data, Payload>) => void
```

Коллбек для отладки

### menuItems

```ts
menuItems: IFieldMenu<any, any>[]
```

Позволяет создать контекстное меню

### hidden

```ts
hidden: boolean | ((payload: Payload) => boolean)
```

Флаг, убирающий поле из древа отрисовки. Следует использовать для
создания динамических значений полей компонента

### phoneHidden

```ts
phoneHidden: boolean | ((payload: Payload) => boolean)
```

Исключает группу из DOM древа на телефоне

### tabletHidden

```ts
tabletHidden: boolean | ((payload: Payload) => boolean)
```

Исключает группу из DOM древа на планшете

### desktopHidden

```ts
desktopHidden: boolean | ((payload: Payload) => boolean)
```

Исключает группу из DOM древа на компьютере

### features

```ts
features: string[]
```

Список бизнес-функций, необходимых для отображения поля

### noBaseline

```ts
noBaseline: boolean
```

Отключает нижний baseline для текущей компоновки

### baseline

```ts
baseline: boolean
```

Принудительно включает нижний baseline для текущей компоновки

### labelShrink

```ts
labelShrink: boolean
```

Флаг, удерживающий подпись текстового поля при пустом
значении

### focus

```ts
focus: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

Коллбеки, вызываемый при фокусировке и потере фокуса.
Подразумевается изменение формы со стороны прикладного
программиста, а не работа с полем ввода
(например, обновление ссылки на изображение)

### blur

```ts
blur: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### menu

```ts
menu: (name: string, action: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

Коллбек для обработки клика по элементу контекстного меню

### click

```ts
click: (name: string, e: MouseEvent<HTMLElement, MouseEvent>, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void | Promise<...>
```

Перехват клика по полю, следует использовать для копирования значения
у карточек просмотра без редактирования

### readonly

```ts
readonly: boolean
```

Флаг только на чтение и "круглой окаймовки"

### outlined

```ts
outlined: boolean
```

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```

Передает ссылку при перерисовках

### inputRef

```ts
inputRef: (element?: HTMLInputElement) => void
```

### autoFocus

```ts
autoFocus: boolean
```

Автофокус и постоянное отключение поля

### disabled

```ts
disabled: boolean
```

### radioValue

```ts
radioValue: string
```

Поле, специфичное для RadioField и позволяющее
задать значение при выборе элемента кликом

### switchNoColor

```ts
switchNoColor: boolean
```

Отключает цвет для Switch

### switchActiveLabel

```ts
switchActiveLabel: string
```

Применяет к Switch второй title

### inputType

```ts
inputType: "number" | "text" | "color" | "date" | "email" | "month" | "password" | "search" | "tel" | "time" | "url" | "week"
```

Поле type для MatTextField

### inputPattern

```ts
inputPattern: string
```

Паттерн для MatTextField
(inputmode: 'decimal' и pattern: '[0-9.,]+' добавят запятую на iOS клавиатуре)

### inputMode

```ts
inputMode: "text" | "email" | "search" | "tel" | "url" | "none" | "numeric" | "decimal"
```

Поле inputmode для MatTextField

### inputFormatter

```ts
inputFormatter: (input: string) => string
```

Форматтер, преобразующий пользовательский
ввод к нужному шаблону

### inputFormatterTemplate

```ts
inputFormatterTemplate: string
```

Шаблонов для форматтера

### inputFormatterSymbol

```ts
inputFormatterSymbol: string
```

Разделитель шаблона форматтера,
по дефолту 0

### inputFormatterAllowed

```ts
inputFormatterAllowed: RegExp | ((char: string, idx: number) => boolean)
```

Разрешенные к вводу символы

### inputFormatterReplace

```ts
inputFormatterReplace: (char: string) => string
```

Замена символов для форматерра, например
запятую на точку в числе

### inputAutocomplete

```ts
inputAutocomplete: "new-password" | "on" | "off" | "false"
```

### tabList

```ts
tabList: string[]
```

Список вкладок для TabLayout

### tabIndex

```ts
tabIndex: number
```

Номер активной вкладки по-умолчанию

### tabVariant

```ts
tabVariant: "fullWidth" | "standard" | "scrollable"
```

Вариант вывода вкладок для TabLayout

### tabColor

```ts
tabColor: "primary" | "secondary"
```

Цвет вкладок для TabLayout

### tabKeepFlow

```ts
tabKeepFlow: boolean
```

Позволяет содержимому растягивать высоту блока
у TabLayout

### tabChange

```ts
tabChange: (idx: number) => void
```

Событие изменения вкладки

### tabLine

```ts
tabLine: boolean
```

Отделяет табы отчерком у TabLayout

### tabBackground

```ts
tabBackground: boolean
```

Закрашивает фон TabLayout в темный цвет

### inputRows

```ts
inputRows: number
```

Делает TextField многострочным, если
inputRows больше единицы

### leadingIconRipple

```ts
leadingIconRipple: boolean
```

Ripple эффект для иконок

### trailingIconRipple

```ts
trailingIconRipple: boolean
```

### leadingIcon

```ts
leadingIcon: ComponentType<any>
```

Иконки для MatTextField

### trailingIcon

```ts
trailingIcon: ComponentType<any>
```

### leadingIconClick

```ts
leadingIconClick: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void
```

При клике на иконку мы можем запросить данные из модального
окна, расположенного в коде прикладного программиста. Коллбек
получает на вход текущее значение поля и функцию onChange...

### trailingIconClick

```ts
trailingIconClick: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void
```

### leadingIconTabIndex

```ts
leadingIconTabIndex: number
```

Если нужно убрать фокус после нажатия tab

### trailingIconTabIndex

```ts
trailingIconTabIndex: number
```

### maxPercent

```ts
maxPercent: number
```

Максимальное число для высчитывания процента
(минимальное число всегда ноль)

### lineTransparent

```ts
lineTransparent: boolean
```

Отключает отчерк у линии

### showPercentLabel

```ts
showPercentLabel: boolean
```

Показывает процент числом слева

### innerPadding

```ts
innerPadding: string
```

Внутренние отступы для Paper

### outlinePaper

```ts
outlinePaper: boolean
```

Превращает FieldType.Paper в FieldType.Outline

### transparentPaper

```ts
transparentPaper: boolean
```

### sliderThumbColor

```ts
sliderThumbColor: (v: number) => string
```

- Коллбеки, позволяющий перекрасить SliderField.
Работают только если заданы все вместе
- ВНИМАНИЕ! Потенциально возможна просадка производительности,
так как осуществляет рекомпиляцию стилей material-ui

### sliderTrackColor

```ts
sliderTrackColor: (v: number) => string
```

### sliderRailColor

```ts
sliderRailColor: (v: number) => string
```

### progressColor

```ts
progressColor: (v: number) => string
```

- Коллбеки, позволяющие перекрасить ProgressField.
Работают только если заданы все вместе
- ВНИМАНИЕ! Потенциально возможна просадка производительности,
так как осуществляет рекомпиляцию стилей material-ui

### progressBarColor

```ts
progressBarColor: (v: number) => string
```

### minSlider

```ts
minSlider: number
```

Поля, специфичные для SliderField

### maxSlider

```ts
maxSlider: number
```

### stepSlider

```ts
stepSlider: number
```

### labelFormatSlider

```ts
labelFormatSlider: (v: number) => string | number
```

### tip

```ts
tip: string[] | ((value: string, data: Data, payload: Payload) => string[] | Promise<string[]>)
```

Подсказки для CompleteField

### tipSelect

```ts
tipSelect: (value: string, data: Data, payload: Payload, onChange: (data: Data) => void) => void
```

Коллбек выбора элемента из CompleteField

### freeSolo

```ts
freeSolo: boolean
```

Поле, позволяющее передавать собственные значения в FieldType.Items и FieldType.Combo

### virtualListBox

```ts
virtualListBox: boolean
```

Позволяет включить виртуализацию для FieldType.List и FieldType.Combo

### itemList

```ts
itemList: string[] | ((data: Data, payload: Payload) => string[]) | ((data: Data, payload: Payload) => Promise<string[]>)
```

Варианты выбора для ComboField и ItemsField

### itemTree

```ts
itemTree: ITreeNode[] | ((data: Data, payload: Payload) => ITreeNode[]) | ((data: Data, payload: Payload) => Promise<ITreeNode[]>)
```

Вариант выбора для TreeField

### noDeselect

```ts
noDeselect: boolean
```

Отключает возможность сброса выбора значения для Items и Combo

### watchItemList

```ts
watchItemList: boolean
```

Включает change-detection для выпадающих меню. По умолчанию выключено

### watchOneContext

```ts
watchOneContext: boolean
```

Включает change-detection для поля компонента. По умолчанию выключено

### shouldRecompute

```ts
shouldRecompute: (prevData: Data, nextData: Data, payload: Payload) => boolean
```

Позволяет мемоизировать вызов compute

### shouldUpdateTr

```ts
shouldUpdateTr: (prevArgs: [string, Data], currentArgs: [string, Data], payload: Payload) => boolean
```

Позволяет мемоизировать перевод

### shouldUpdateItemList

```ts
shouldUpdateItemList: (prevData: Data, currentData: Data, payload: Payload) => boolean
```

Позволяет мемоизировать список элементов

### tr

```ts
tr: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>)
```

Позволяет перевести значения у ComboField и ItemsField
из поле itemList на человеческий, если
используются константы

### keepRaw

```ts
keepRaw: boolean
```

Отключает fulltext фильтр для FieldType.Complete

### type

```ts
type: FieldType
```

Тип поля для логического ветвления при рендеринге

### className

```ts
className: string
```

Наименование класса для корневого элемента поля (опционально)

### style

```ts
style: CSSProperties
```

Стиль корневого элемента для поля (опционально)

### title

```ts
title: string
```

Заголовок и описание, если возможен вывод у поля

### description

```ts
description: string
```

### placeholder

```ts
placeholder: string
```

placeholder для TextField, ComboField, ItemsField

### columns

```ts
columns: string
```

Колонки для One. Не используются в List (кроме фильтров).
Если указано поле columns, то остальные приравниваются к
его значению

### phoneColumns

```ts
phoneColumns: string
```

### tabletColumns

```ts
tabletColumns: string
```

### desktopColumns

```ts
desktopColumns: string
```

### sx

```ts
sx: SxProps<any>
```

Специальное поле только для MUI

### columnsOverride

```ts
columnsOverride: string
```

Произвольное количество колонок в строке

### fields

```ts
fields: IField<Data, any>[]
```

Дочерние поля для групп

### child

```ts
child: IField<Data, any>
```

### isInvalid

```ts
isInvalid: (v: Data, payload: Payload) => string
```

Функция, позволяющая организовать валидацию. Если
возвращаемое значение не равно null, считается за
ошибкую

### isIncorrect

```ts
isIncorrect: (v: Data, payload: Payload) => string
```

Функция, позволяющая огранизовать неблокирующую валидацию. Проверка
правописания (spellcheck) должен быть отображен в UI, но не должен
блокировать кнопку "Сохранить"

### isVisible

```ts
isVisible: (v: Data, payload: Payload) => boolean
```

Функция, позволяющая скрыть поле, исходя из целевого
объекта

### isDisabled

```ts
isDisabled: (v: Data, payload: Payload) => boolean
```

Функция, позволяющая отключить поле, исходя из целевого
объекта

### isReadonly

```ts
isReadonly: (v: Data, payload: Payload) => boolean
```

Функция, позволяющая отключить ввод данных в поле, исходя из целевого
объекта

### compute

```ts
compute: (v: Data, payload: Payload) => Value | Promise<Value>
```

Функция, применяемая если значение поля вычисляется динамически.
Включает readonly.

### element

```ts
element: ComponentType<ComponentFieldInstance<Data, Payload>>
```

Инъекция JSX для ComponentField

### invalidity

```ts
invalidity: (name: string, e: string, payload: Payload) => void
```

Коллбек, вызываемый у поля при не прохождении
валидации

### map

```ts
map: (data: Data, payload: Payload) => Data
```

Коллбек для 2Way биндингов. Вызывается если поле валидно
перед применением нового целевого объекта при исходящем изменении

### defaultValue

```ts
defaultValue: Value | ((payload: Payload) => Value)
```

Значение по-умолчанию для поля

### dictLimit

```ts
dictLimit: number
```

Позволяет задать limit для поля справочника

### dictDelay

```ts
dictDelay: number
```

Позволяет задать задержку для api запросов поля справочника

### dictSearch

```ts
dictSearch: (dto: { search: string; limit: number; offset: number; initial: boolean; rows: ISearchItem<any>[]; data: Data; payload: Payload; }) => ISearchItem<any>[] | Promise<...>
```

Обработчик запроса справочника. Если число объектов
меньше dictLimit, подразумевается, что все данные выгружены
на фронт и новые запросы не выполняются

### dictOnAppend

```ts
dictOnAppend: (search: string, data: Data, payload: Payload, onValueChange: (value: string) => void, onChange: (value: Data) => void) => void
```

Поле справочника позволяет создавать новые записи, если
поиск не дал результата

### dictOnText

```ts
dictOnText: (text: string, data: Data, payload: Payload, onValueChange: (value: string) => void, onChange: (data: Data) => void) => void
```

Функция вызывается на каждое изменение текста. Подразумевается
запись в целевой объект. Для контекстного поиска по label, value можно записать в другое поле

### dictOnItem

```ts
dictOnItem: (value: string, data: Data, payload: Payload, onValueChange: (value: string) => void, onChange: (data: Data) => void) => void
```

Функция вызывается на каждый выбор из модалки. Подразумевается
запись в целевой объект. Для контекстного поиска по label, value можно записать в другое поле

### dictValue

```ts
dictValue: (value: string, data: Data, payload: Payload) => ISearchItem<any> | Promise<ISearchItem<any>>
```

Функция позволяет загрузить label для выбранного элемента асинхронно

### dictSearchText

```ts
dictSearchText: (data: Data, payload: Payload) => string | Promise<string>
```

Функция позволяет загрузить searchText для выбранного элемента асинхронно

### dictSearchItem

```ts
dictSearchItem: ComponentType<ISearchItemProps<any>>
```

Функция позволяет переопределить компонент элемента списка
из модалки

### dictCreateButton

```ts
dictCreateButton: ComponentType<ICreateButtonProps>
```

Функция позволяет переопределить компонент создание записи
в словарь из модалки

### fieldRightMargin

```ts
fieldRightMargin: string
```

Позволяет выключить отступ. Можно использовать по аналогии
с исключением последней запятой при склеивании массива
руками, если раздражает

### fieldBottomMargin

```ts
fieldBottomMargin: string
```

### typoVariant

```ts
typoVariant: "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2"
```

Шрифт для поля Typography

### expansionOpened

```ts
expansionOpened: boolean
```

Поле для ExpansionLayout

### customLayout

```ts
customLayout: (props: PropsWithChildren<Data & { onChange: (data: Partial<Data>) => void; _fieldData: Data; _fieldParams: IField<any, any>; _payload: Payload; }>) => ReactElement<...>
```

Коллбек, позволяющий применить собственную компоновку

### condition

```ts
condition: ((data: Data, payload: Payload) => boolean) | ((data: Data, payload: Payload) => Promise<boolean>)
```

Предикат для компоновки Condition

### shouldCondition

```ts
shouldCondition: (prevData: Data, nextData: Data, payload: Payload) => boolean
```

Позволяет мемоизировать вызов condition

### conditionLoading

```ts
conditionLoading: ComponentType<{ data: Data; payload: Payload; }>
```

Компонент отображения загрузки condition

### conditionElse

```ts
conditionElse: ComponentType<{ data: Data; payload: Payload; }>
```

Компонент отображения else для condition

### fileAccept

```ts
fileAccept: string
```

mime тип выбираемого файла

### upload

```ts
upload: (file: File, data: Data, payload: Payload) => string | Promise<string>
```

Функция для загрузки файла на сервер

### view

```ts
view: (file: string, data: Data, payload: Payload) => void | Promise<void>
```

### choose

```ts
choose: (data: Data, payload: Payload) => string | string[] | Promise<string | string[]>
```

Функция для выбора документа из справочника
для useSearchModal

### top

```ts
top: string | ISizeCallback<Data>
```

Свойства для компоновки Hero - инструмента настройки отступов

### phoneTop

```ts
phoneTop: string | ISizeCallback<Data>
```

### tabletTop

```ts
tabletTop: string | ISizeCallback<Data>
```

### desktopTop

```ts
desktopTop: string | ISizeCallback<Data>
```

### left

```ts
left: string | ISizeCallback<Data>
```

### phoneLeft

```ts
phoneLeft: string | ISizeCallback<Data>
```

### tabletLeft

```ts
tabletLeft: string | ISizeCallback<Data>
```

### desktopLeft

```ts
desktopLeft: string | ISizeCallback<Data>
```

### right

```ts
right: string | ISizeCallback<Data>
```

### phoneRight

```ts
phoneRight: string | ISizeCallback<Data>
```

### tabletRight

```ts
tabletRight: string | ISizeCallback<Data>
```

### desktopRight

```ts
desktopRight: string | ISizeCallback<Data>
```

### bottom

```ts
bottom: string | ISizeCallback<Data>
```

### phoneBottom

```ts
phoneBottom: string | ISizeCallback<Data>
```

### tabletBottom

```ts
tabletBottom: string | ISizeCallback<Data>
```

### desktopBottom

```ts
desktopBottom: string | ISizeCallback<Data>
```

### height

```ts
height: string | ISizeCallback<Data>
```

### phoneHeight

```ts
phoneHeight: string | ISizeCallback<Data>
```

### tabletHeight

```ts
tabletHeight: string | ISizeCallback<Data>
```

### desktopHeight

```ts
desktopHeight: string | ISizeCallback<Data>
```

### minHeight

```ts
minHeight: string | ISizeCallback<Data>
```

### phoneMinHeight

```ts
phoneMinHeight: string | ISizeCallback<Data>
```

### tabletMinHeight

```ts
tabletMinHeight: string | ISizeCallback<Data>
```

### desktopMinHeight

```ts
desktopMinHeight: string | ISizeCallback<Data>
```

### maxHeight

```ts
maxHeight: string | ISizeCallback<Data>
```

### phoneMaxHeight

```ts
phoneMaxHeight: string | ISizeCallback<Data>
```

### tabletMaxHeight

```ts
tabletMaxHeight: string | ISizeCallback<Data>
```

### desktopMaxHeight

```ts
desktopMaxHeight: string | ISizeCallback<Data>
```

### width

```ts
width: string | ISizeCallback<Data>
```

### phoneWidth

```ts
phoneWidth: string | ISizeCallback<Data>
```

### tabletWidth

```ts
tabletWidth: string | ISizeCallback<Data>
```

### desktopWidth

```ts
desktopWidth: string | ISizeCallback<Data>
```

### minWidth

```ts
minWidth: string | ISizeCallback<Data>
```

### phoneMinWidth

```ts
phoneMinWidth: string | ISizeCallback<Data>
```

### tabletMinWidth

```ts
tabletMinWidth: string | ISizeCallback<Data>
```

### desktopMinWidth

```ts
desktopMinWidth: string | ISizeCallback<Data>
```

### maxWidth

```ts
maxWidth: string | ISizeCallback<Data>
```

### phoneMaxWidth

```ts
phoneMaxWidth: string | ISizeCallback<Data>
```

### tabletMaxWidth

```ts
tabletMaxWidth: string | ISizeCallback<Data>
```

### desktopMaxWidth

```ts
desktopMaxWidth: string | ISizeCallback<Data>
```

### heroOuterStyle

```ts
heroOuterStyle: CSSProperties
```

### heroOuterPhoneStyle

```ts
heroOuterPhoneStyle: CSSProperties
```

### heroOuterTabletStyle

```ts
heroOuterTabletStyle: CSSProperties
```

### heroOuterDesktopStyle

```ts
heroOuterDesktopStyle: CSSProperties
```

### heroInnerStyle

```ts
heroInnerStyle: CSSProperties
```

### heroInnerPhoneStyle

```ts
heroInnerPhoneStyle: CSSProperties
```

### heroInnerTabletStyle

```ts
heroInnerTabletStyle: CSSProperties
```

### heroInnerDesktopStyle

```ts
heroInnerDesktopStyle: CSSProperties
```

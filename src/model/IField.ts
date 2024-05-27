import * as React from 'react';
import { SxProps } from '@mui/material';

import type ComponentFieldInstance  from './ComponentFieldInstance';
import type { IDebug }  from './ComponentFieldInstance';

import { ISizeCallback } from './ISize';

import FieldType from './FieldType';
import IAnything from './IAnything';
import ISearchItem from '../components/SearchView/model/ISearchItem';
import ISearchViewProps from '../components/SearchView/model/ISearchViewProps';
import IFieldMenu from './IFieldMenu';
import ITreeNode from './ITreeNode';
import IValidation from './IValidation';

/**
 * Represents any possible variable value of <One /> component field.
 *
 * @typedef Value - Represents a value in JavaScript.
 */
export type Value = string | string[] | number | boolean | null;

/**
 * Объект поля для прикладного программиста
 */
export interface IField<Data = IAnything, Payload = IAnything> {

    /**
     * Параметры фабрики для создания коллбека isInvalid
     */
    validation?: IValidation;

    /**
     * Атрибут, который будет передат в data-testid
     * корневому элементу компоновки
     */
    testId?: string;

    /**
     * Общие поля. Поле name позволяет задать забор
     * поля из целевого объекта, не нужен для group,
     * expansion и line.
     */
    name?: string;

    /**
     * Коллбек для отладки
     */
    debug?: (params: IDebug<Data, Payload>) => void;

    /**
     * Позволяет создать контекстное меню
     */
    menuItems?: IFieldMenu[];

    /**
     * Флаг, убирающий поле из древа отрисовки. Следует использовать для
     * создания динамических значений полей компонента
     */
    hidden?: boolean | ((payload: Payload) => boolean);

    /**
     * Исключает группу из DOM древа на телефоне
     */
    phoneHidden?: boolean | ((payload: Payload) => boolean);

    /**
     * Исключает группу из DOM древа на планшете
     */
    tabletHidden?: boolean | ((payload: Payload) => boolean);

    /**
     * Исключает группу из DOM древа на компьютере
     */
    desktopHidden?: boolean | ((payload: Payload) => boolean);

    /**
     * Список бизнес-функций, необходимых для отображения поля
     */
    features?: string[];

    /**
     * Отключает нижний baseline для текущей компоновки
     */
    noBaseline?: boolean;

    /**
     * Флаг, удерживающий подпись текстового поля при пустом
     * значении
     */
    labelShrink?: boolean;

    /**
     * Коллбеки, вызываемый при фокусировке и потере фокуса.
     * Подразумевается изменение формы со стороны прикладного
     * программиста, а не работа с полем ввода
     * (например, обновление ссылки на изображение)
     */
    focus?: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;
    blur?: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;

    /**
     * Коллбек для обработки клика по элементу контекстного меню
     */
    menu?: (name: string, action: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;

    /**
     * Перехват клика по полю, следует использовать для копирования значения
     * у карточек просмотра без редактирования
     */
    click?: (name: string, e: React.MouseEvent<HTMLElement>, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;

    /**
     * Флаг только на чтение и "круглой окаймовки"
     */
    readonly?: boolean;
    outlined?: boolean;

    /**
     * Передает ссылку при перерисовках
     */
    groupRef?: (element?: HTMLDivElement | null) => void;
    inputRef?: (element?: HTMLInputElement | null) => void;

    /**
     * Автофокус и постоянное отключение поля
     */
    autoFocus?: boolean;
    disabled?: boolean;

    /**
     * Поле, специфичное для RadioField и позволяющее
     * задать значение при выборе элемента кликом
     */
    radioValue?: string;

    /**
     * Отключает цвет для Switch
     */
    switchNoColor?: boolean;

    /**
     * Применяет к Switch второй title
     */
    switchActiveLabel?: string;

    /**
     * Поле type для MatTextField
     */
    inputType?: keyof {
      'text': never,
      'color': never,
      'date': never,
      'email': never,
      'month': never,
      'number': never,
      'password': never,
      'search': never,
      'tel': never,
      'time': never,
      'url': never,
      'week': never,
    };

    /**
     * Паттерн для MatTextField
     * (inputmode: 'decimal' и pattern: '[0-9.,]+' добавят запятую на iOS клавиатуре)
     */
    inputPattern?: string;

    /**
     * Поле inputmode для MatTextField
     */
    inputMode?: keyof {
      'none': never;
      'text': never;
      'tel': never;
      'url': never;
      'email': never;
      'numeric': never;
      'decimal': never;
      'search': never;
    };

    /**
     * Форматтер, преобразующий пользовательский
     * ввод к нужному шаблону
     */
    inputFormatter?: (input: string) => string;

    /**
     * Шаблонов для форматтера
     */
    inputFormatterTemplate?: string;

    /**
     * Разделитель шаблона форматтера,
     * по дефолту 0
     */
    inputFormatterSymbol?: string;

    /**
     * Разрешенные к вводу символы
     */
    inputFormatterAllowed?: RegExp | ((char: string, idx: number) => boolean);

    /**
     * Замена символов для форматерра, например
     * запятую на точку в числе
     */
    inputFormatterReplace?: (char: string) => string | null;

    inputAutocomplete?: keyof {
      'new-password': never,
      'on': never,
      'off': never,
      'false': never,
    };

    /**
     * Список вкладок для TabLayout
     */
    tabList?: string[];

    /**
     * Номер активной вкладки по-умолчанию
     */
    tabIndex?: number;

    /**
     * Вариант вывода вкладок для TabLayout
     */
    tabVariant?: "fullWidth" | "standard" | "scrollable";

    /**
     * Цвет вкладок для TabLayout
     */
    tabColor?: "primary" | "secondary";

    /**
     * Позволяет содержимому растягивать высоту блока
     * у TabLayout
     */
    tabKeepFlow?: boolean;

    /**
     * Событие изменения вкладки
     */
    tabChange?: (idx: number) => void;

    /**
     * Отделяет табы отчерком у TabLayout
     */
    tabLine?: boolean;

    /**
     * Закрашивает фон TabLayout в темный цвет
     */
    tabBackground?: boolean;

    /**
     * Делает TextField многострочным, если
     * inputRows больше единицы
     */
    inputRows?: number;

    /**
     * Ripple эффект для иконок
     */
    leadingIconRipple?: boolean;
    trailingIconRipple?: boolean;

    /**
     * Иконки для MatTextField
     */
    leadingIcon?: React.ComponentType<any>;
    trailingIcon?: React.ComponentType<any>;

    /**
     * При клике на иконку мы можем запросить данные из модального
     * окна, расположенного в коде прикладного программиста. Коллбек
     * получает на вход текущее значение поля и функцию onChange...
     */
    leadingIconClick?: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void;
    trailingIconClick?: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void;

    /**
     * Максимальное число для высчитывания процента
     * (минимальное число всегда ноль)
     */
    maxPercent?: number;

    /**
     * Отключает отчерк у линии
     */
    lineTransparent?: boolean;

    /**
     * Показывает процент числом слева
     */
    showPercentLabel?: boolean;

    /**
     * Внутренние отступы для Paper
     */
    innerPadding?: string;

    /**
     * Превращает FieldType.Paper в FieldType.Outline
     */
    outlinePaper?: boolean;
    transparentPaper?: boolean;

    /**
     * - Коллбеки, позволяющий перекрасить SliderField.
     * Работают только если заданы все вместе
     * - ВНИМАНИЕ! Потенциально возможна просадка производительности,
     * так как осуществляет рекомпиляцию стилей material-ui
     */
    sliderThumbColor?: (v: number) => string,
    sliderTrackColor?: (v: number) => string,
    sliderRailColor?: (v: number) => string,

    /**
     *  - Коллбеки, позволяющие перекрасить ProgressField.
     * Работают только если заданы все вместе
     *  - ВНИМАНИЕ! Потенциально возможна просадка производительности,
     * так как осуществляет рекомпиляцию стилей material-ui
     */
    progressColor?: (v: number) => string,
    progressBarColor?: (v: number) => string,

    /**
     * Поля, специфичные для SliderField
     */
    minSlider?: number;
    maxSlider?: number;
    stepSlider?: number;
    labelFormatSlider?: (v: number) => string | number;

    /**
     * Подсказки для CompleteField
     */
    tip?: string[] | ((value: string, data: Data, payload: Payload) => (string[] | Promise<string[]>));

    /**
     * Коллбек выбора элемента из CompleteField
     */
    tipSelect?: (value: string, data: Data, payload: Payload, onChange: (data: Data) => void) => void;

    /**
     * Поле, позволяющее передавать собственные значения в FieldType.Items и FieldType.Combo
     */
    freeSolo?: boolean;

    /**
     * Позволяет включить виртуализацию для FieldType.List и FieldType.Combo
     */
    virtualListBox?: boolean;

    /**
     * Варианты выбора для ComboField и ItemsField
     */
    itemList?: string[] | ((data: Data, payload: Payload) => string[]) | ((data: Data, payload: Payload) => Promise<string[]>),

    /**
     * Вариант выбора для TreeField
     */
    itemTree?: ITreeNode[] | ((data: Data, payload: Payload) => ITreeNode[]) | ((data: Data, payload: Payload) => Promise<ITreeNode[]>);

    /**
     * Отключает возможность сброса выбора значения для Items и Combo
     */
    noDeselect?: boolean;

    /**
     * Включает change-detection для выпадающих меню. По умолчанию выключено
     */
    watchItemList?: boolean;

    /**
     * Включает change-detection для поля компонента. По умолчанию выключено
     */
    watchOneContext?: boolean;

    /**
     * Позволяет мемоизировать вызов compute
     */
    shouldRecompute?: (prevData: Data, nextData: Data, payload: Payload) => boolean;

    /**
     * Позволяет мемоизировать перевод
     */
    shouldUpdateTr?: (prevArgs: [string, Data], currentArgs: [string, Data], payload: Payload) => boolean;

    /**
     * Позволяет мемоизировать список элементов
     */
    shouldUpdateItemList?: (prevData: Data, currentData: Data, payload: Payload) => boolean;

    /**
     * Позволяет перевести значения у ComboField и ItemsField
     * из поле itemList на человеческий, если
     * используются константы
     */
    tr?: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>),

    /**
     * Отключает fulltext фильтр для FieldType.Complete
     */
    keepRaw?: boolean;

    /**
     * Тип поля для логического ветвления при рендеринге
     */
    type: FieldType;

    /**
     * Наименование класса для корневого элемента поля (опционально)
     */
    className?: string;

    /**
     * Стиль корневого элемента для поля (опционально)
     */
    style?: React.CSSProperties;

    /**
     * Заголовок и описание, если возможен вывод у поля
     */
    title?: string;
    description?: string;

    /**
     * placeholder для TextField, ComboField, ItemsField
     */
    placeholder?: string;

    /**
     * Колонки для One. Не используются в List (кроме фильтров).
     * Если указано поле columns, то остальные приравниваются к
     * его значению
     */
    columns?: string;
    phoneColumns?: string;
    tabletColumns?: string;
    desktopColumns?: string;

    /**
     * Специальное поле только для MUI
     */
    sx?: SxProps<any>;

    /**
     * Произвольное количество колонок в строке
     */
    columnsOverride?: string;

    /**
     * Дочерние поля для групп
     */
    fields?: IField<Data>[];
    child?: IField<Data>;

    /**
     * Функция, позволяющая организовать валидацию. Если
     * возвращаемое значение не равно null, считается за
     * ошибкую
     */
    isInvalid?: (v: Data, payload: Payload) => null | string;

    /**
     * Функция, позволяющая огранизовать неблокирующую валидацию. Проверка
     * правописания (spellcheck) должен быть отображен в UI, но не должен
     * блокировать кнопку "Сохранить"
     */
    isIncorrect?: (v: Data, payload: Payload) => null | string;

    /**
     * Функция, позволяющая скрыть поле, исходя из целевого
     * объекта
     */
    isVisible?: (v: Data, payload: Payload) => boolean;

    /**
     * Функция, позволяющая отключить поле, исходя из целевого
     * объекта
     */
    isDisabled?: (v: Data, payload: Payload) => boolean;

    /**
     * Функция, позволяющая отключить ввод данных в поле, исходя из целевого
     * объекта
     */
    isReadonly?: (v: Data, payload: Payload) => boolean;

    /**
     * Функция, применяемая если значение поля вычисляется динамически.
     * Включает readonly.
     */
    compute?: (v: Data, payload: Payload) => (Promise<Value> | Value);

    /**
     * Инъекция JSX для ComponentField
     */
    element?: React.ComponentType<ComponentFieldInstance<Data, Payload>>;

    /**
     * Коллбек, вызываемый у поля при не прохождении
     * валидации
     */
    invalidity?: (name: string, e: string, payload: Payload) => void;

    /**
     * Коллбек для 2Way биндингов. Вызывается если поле валидно
     * перед применением нового целевого объекта при исходящем изменении
     */
    map?: (data: Data, payload: Payload) => Data;

    /**
     * Значение по-умолчанию для поля
     */
    defaultValue?: Value | ((payload: Payload) => Value);

    /**
     * Позволяет задать limit для поля справочника
     */
    dictLimit?: number;

    /**
     * Позволяет задать задержку для api запросов поля справочника
     */
    dictDelay?: number;
  
    /**
     * Обработчик запроса справочника. Если число объектов
     * меньше dictLimit, подразумевается, что все данные выгружены
     * на фронт и новые запросы не выполняются
     */
    dictSearch?: (dto: {
      search: string;
      limit: number;
      offset: number;
      initial: boolean;
      rows: ISearchItem[];
      data: Data;
      payload: Payload;
    }) => ISearchItem[] | Promise<ISearchItem[]>;

    /**
     * Поле справочника позволяет создавать новые записи, если
     * поиск не дал результата
     */
    dictOnAppend?: (search: string, data: Data, payload: Payload, onValueChange: (value: string | null) => void, onChange: (value: Data) => void) => void;

    /**
     * Функция вызывается на каждое изменение текста. Подразумевается
     * запись в целевой объект. Для контекстного поиска по label, value можно записать в другое поле
     */
    dictOnText?: (text: string, data: Data, payload: Payload, onValueChange: (value: string | null) => void, onChange: (data: Data) => void) => void;

    /**
     * Функция вызывается на каждый выбор из модалки. Подразумевается
     * запись в целевой объект. Для контекстного поиска по label, value можно записать в другое поле
     */
    dictOnItem?: (value: string | null, data: Data, payload: Payload, onValueChange: (value: string | null) => void, onChange: (data: Data) => void) => void;

    /**
     * Функция позволяет загрузить label для выбранного элемента асинхронно
     */
    dictValue?: (value: string, data: Data, payload: Payload) => (ISearchItem | Promise<ISearchItem>);

    /**
     * Функция позволяет загрузить searchText для выбранного элемента асинхронно
     */
    dictSearchText?: (data: Data, payload: Payload) => (string | Promise<string>);

    /**
     * Функция позволяет переопределить компонент элемента списка
     * из модалки
     */
    dictSearchItem?: ISearchViewProps['SearchItem'];

    
    /**
     * Функция позволяет переопределить компонент создание записи
     * в словарь из модалки
     */
    dictCreateButton?: ISearchViewProps['CreateButton'];

    /**
     * Позволяет выключить отступ. Можно использовать по аналогии
     * с исключением последней запятой при склеивании массива
     * руками, если раздражает
     */
    fieldRightMargin?: string;
    fieldBottomMargin?: string;

    /**
     * Шрифт для поля Typography
     */
    typoVariant?: keyof {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'subtitle1',
      subtitle2: 'subtitle2',
      body1: 'body1',
      body2: 'body2',
      caption: 'caption',
    };

    /**
     * Поле для ExpansionLayout
     */
    expansionOpened?: boolean;

    /**
     * Коллбек, позволяющий применить собственную компоновку
     */
    customLayout?: (props: React.PropsWithChildren<Data & {
      onChange: (data: Partial<Data>) => void;
      _fieldData: Data;
      _fieldParams: IField;
      _payload: Payload;
    }>) => React.ReactElement;

    /**
     * Предикат для компоновки Condition
     */
    condition?: ((data: Data, payload: Payload) => boolean) | ((data: Data, payload: Payload) => Promise<boolean>)

    /**
     * Позволяет мемоизировать вызов condition
     */
    shouldCondition?: (prevData: Data, nextData: Data, payload: Payload) => boolean;

    /**
     * Компонент отображения загрузки condition
     */
    conditionLoading?: React.ComponentType<{ data: Data; payload: Payload }>;

    /**
     * Компонент отображения else для condition
     */
    conditionElse?: React.ComponentType<{ data: Data; payload: Payload }>;

    /**
     * mime тип выбираемого файла
     */
    fileAccept?: string;

    /**
     * Функция для загрузки файла на сервер
     */
    upload?: (file: File, data: Data, payload: Payload) => (Promise<string> | string);
    view?: (file: string, data: Data, payload: Payload) => (Promise<void> | void);

    /**
     * Функция для выбора документа из справочника
     * для useSearchModal
     */
    choose?: (data: Data, payload: Payload) => (Promise<string | string[] | null> | string | string[] | null);

    /**
     * Свойства для компоновки Hero - инструмента настройки отступов
     */
    top?: string | ISizeCallback<Data>;
    phoneTop?: string | ISizeCallback<Data>;
    tabletTop?: string | ISizeCallback<Data>;
    desktopTop?: string | ISizeCallback<Data>;
    left?: string | ISizeCallback<Data>;
    phoneLeft?: string | ISizeCallback<Data>;
    tabletLeft?: string | ISizeCallback<Data>;
    desktopLeft?: string | ISizeCallback<Data>;
    right?: string | ISizeCallback<Data>;
    phoneRight?: string | ISizeCallback<Data>;
    tabletRight?: string | ISizeCallback<Data>;
    desktopRight?: string | ISizeCallback<Data>;
    bottom?: string | ISizeCallback<Data>;
    phoneBottom?: string | ISizeCallback<Data>;
    tabletBottom?: string | ISizeCallback<Data>;
    desktopBottom?: string | ISizeCallback<Data>;
    height?: string | ISizeCallback<Data>;
    phoneHeight?: string | ISizeCallback<Data>;
    tabletHeight?: string | ISizeCallback<Data>;
    desktopHeight?: string | ISizeCallback<Data>;
    minHeight?: string | ISizeCallback<Data>;
    phoneMinHeight?: string | ISizeCallback<Data>;
    tabletMinHeight?: string | ISizeCallback<Data>;
    desktopMinHeight?: string | ISizeCallback<Data>;
    maxHeight?: string | ISizeCallback<Data>;
    phoneMaxHeight?: string | ISizeCallback<Data>;
    tabletMaxHeight?: string | ISizeCallback<Data>;
    desktopMaxHeight?: string | ISizeCallback<Data>;
    width?: string | ISizeCallback<Data>;
    phoneWidth?: string | ISizeCallback<Data>;
    tabletWidth?: string | ISizeCallback<Data>;
    desktopWidth?: string | ISizeCallback<Data>;
    minWidth?: string | ISizeCallback<Data>;
    phoneMinWidth?: string | ISizeCallback<Data>;
    tabletMinWidth?: string | ISizeCallback<Data>;
    desktopMinWidth?: string | ISizeCallback<Data>;
    maxWidth?: string | ISizeCallback<Data>;
    phoneMaxWidth?: string | ISizeCallback<Data>;
    tabletMaxWidth?: string | ISizeCallback<Data>;
    desktopMaxWidth?: string | ISizeCallback<Data>;
    heroOuterStyle?: React.CSSProperties;
    heroOuterPhoneStyle?: React.CSSProperties;
    heroOuterTabletStyle?: React.CSSProperties;
    heroOuterDesktopStyle?: React.CSSProperties;
    heroInnerStyle?: React.CSSProperties;
    heroInnerPhoneStyle?: React.CSSProperties;
    heroInnerTabletStyle?: React.CSSProperties;
    heroInnerDesktopStyle?: React.CSSProperties;
  }

export default IField;

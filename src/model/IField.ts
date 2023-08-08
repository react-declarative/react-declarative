import * as React from 'react';

import { ISizeCallback } from './ISize';

import FieldType from './FieldType';
import IAnything from './IAnything';
import { SxProps } from '@mui/material';

export type Value = string | string[] | number | boolean | null;

/**
 * Объект поля для прикладного программиста
 */
export interface IField<Data = IAnything, Payload = IAnything> {

    /**
     * Общие поля. Поле name позволяет задать забор
     * поля из целевого объекта, не нужен для group,
     * expansion и line.
     */
    name?: string;

    /**
     * Список ролей, необходимых для отображения поля
     */
    roles?: string[];

    /**
     * Коллбеки, вызываемый при фокусировке и потере фокуса.
     * Подразумевается изменение формы со стороны прикладного
     * программиста, а не работа с полем ввода
     * (например, обновление ссылки на изображение)
     */
    focus?: (name: string, payload: Payload) => void;
    blur?: (name: string, payload: Payload) => void;

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
     * Иконки для MatTextField
     */
    leadingIcon?: React.ComponentType<any>;
    trailingIcon?: React.ComponentType<any>;

    /**
     * При клике на иконку мы можем запросить данные из модального
     * окна, расположенного в коде прикладного программиста. Коллбек
     * получает на вход текущее значение поля и функцию onChange...
     */
    leadingIconClick?: (value: any, payload: Payload, onChange: (v: any) => void) => void;
    trailingIconClick?: (value: any, payload: Payload, onChange: (v: any) => void) => void;

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
     * Варианты выбора для ComboField и ItemsField
     */
    itemList?: string[] | ((data: Data, payload: Payload) => string[]) | ((data: Data, payload: Payload) => Promise<string[]>),

    /**
     * Позволяет указать условия перезагрузки списка
     * элементов
     */
    shouldUpdateItemList?: (prevData: Data | null, nextData: Data, payload: Payload) => boolean,

    /**
     * Позволяет перевести значения у ComboField и ItemsField
     * из поле itemList на человеческий, если
     * используются константы
     */
    tr?: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>),

    /**
     * Флаг для FieldType.Items и FieldType.Combo, который разрешает сабмит по изменению
     * без ожидания потери фокуса
     */
    keepSync?: boolean;

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
    compute?: (v: Data, payload: Payload) => Promise<Value> | Value;

    /**
     * Инъекция JSX для ComponentField
     */
    element?: React.ComponentType<Data & { onChange: (data: Data) => void; }>;

    /**
     * Коллбек, вызываемый у поля при не прохождении
     * валидации
     */
    invalidity?: (name: string, e: string, payload: Payload) => void;

    /**
     * Значение по-умолчанию для поля
     */
    defaultValue?: Value;

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
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'subtitle1',
      subtitle2: 'subtitle2',
      body1: 'body1',
      body2: 'body2',
    };

    /**
     * Поле для ExpansionLayout
     */
    expansionOpened?: boolean;

    /**
     * Предикат для компоновки Condition
     */
    condition?: ((data: Data, payload: Payload) => boolean) | ((data: Data, payload: Payload) => Promise<boolean>)

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
    choose?: (data: Data, payload: Payload) => (Promise<string | null> | string | null);

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

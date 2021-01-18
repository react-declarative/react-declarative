import * as React from 'react';

import FieldType from './FieldType';
import IAnything from './IAnything';

/**
 * Объект поля для прикладного программиста
 */
export interface IField {

    /**
     * Общие поля. Поле name позволяет задать забор
     * поля из целевого объекта, не нужен для group,
     * expansion и line.
     */
    name?: string;

    /**
     * Коллбеки, вызываемый при фокусировкеи потере фокуса.
     * Подразумевается изменение формы со стороны прикладного
     * программиста, а не работа с полем ввода
     * (например, обновление ссылки на изображение)
     */
    focus?: () => void;
    blur?: () => void;

    /**
     * Флаг только на чтение и "круглой окаймовки". У
     * компонента List филды принудительно получают
     * значения false.
     */
    readonly?: boolean;
    outlined?: boolean;

    /**
     * Поле, специфичное для RadioField и позволяющее
     * задать значение при выборе элемента кликом
     */
    radioValue?: string;

    /**
     * Поле type для MatTextField
     */
    inputType?: keyof {
      text: "text",
      color: "color",
      date: "date",
      email: "email",
      month: "month",
      number: "number",
      password: "password",
      search: "search",
      tel: "tel",
      time: "time",
      url: "url",
      week: "week",
    };

    /**
     * Делает TextField многострочным, если
     * inputRows больше единицы
     */
    inputRows?: number;

    /**
     * Иконки для MatTextField
     */
    leadingIcon?: string | React.ComponentType;
    trailingIcon?: string | React.ComponentType;

    /**
     * При клике на иконку мы можем запросить данные из модального
     * окна, расположенного в коде прикладного программиста. Коллбек
     * получает на вход текущее значение поля и функцию onChange...
     */
    leadingIconClick?: (value: IAnything, onChange?: (v: IAnything) => void) => void;
    trailingIconClick?: (value: IAnything, onChange?: (v: IAnything) => void) => void;

    /**
     * Максимальное число для высчитывания процента
     * (минимальное число всегда ноль)
     */
    maxPercent?: number;

    /**
     * Показывает процент числом слева
     */
    showPercentLabel?: boolean;

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

    /**
     * Варианты выбора для ComboField и ItemsField
     */
    itemList?: string[],

    /**
     * Позволяет перевести значения у ComboField и ItemsField
     * из поле itemList на человеческий, если
     * используются константы
     */
    tr?: (s: string | IAnything) => IAnything,

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
     * Дочерние поля для групп
     */
    fields?: IField[];

    /**
     * Функция, позволяющая организовать валидацию. Если
     * возвращаемое значение не равно null, считается за
     * ошибкую. Коллбек change позволяет осуществить мутацию
     * асинхронно (опционально)
     */
    isInvalid?: (v: IAnything, change?: (v: null | string) => void) => null | string;

    /**
     * Функция, позволяющая скрыть поле, исходя из целевого
     * объекта. Коллбек change позволяет осуществить мутацию
     * асинхронно (опционально)
     */
    isVisible?: (v: IAnything, change?: (v: boolean) => void) => boolean;

    /**
     * Функция, позволяющая отключить поле, исходя из целевого
     * объекта. Коллбек change позволяет осуществить мутацию
     * асинхронно (опционально)
     */
    isDisabled?: (v: IAnything, change?: (v: boolean) => void) => boolean;

    /**
     * Функция, применяемая если значение поля вычисляется динамически.
     * Включает readonly. Для ComponentField может возвращать JSX.
     * Коллбек change позволяет осуществить операцию асинхронно (опционально).
     */
    compute?: (v: IAnything, change?: (v: IAnything) => void) => IAnything;

    /**
     * Коллбек, вызываемый у поля при не прохождении
     * валидации
     */
    invalidity?: (e: string) => void;

    /**
     * Значение по-умолчанию для поля
     */
    defaultValue?: string | number | boolean;

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

  }

export default IField;

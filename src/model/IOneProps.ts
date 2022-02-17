
import IField from './IField';
import IAnything from './IAnything';

export type OneHandler<Data = IAnything> = Data | (() => Data | null) | (() => Promise<Data | null>);

export interface IOneProps<Data = IAnything, Field = IField<Data>> {
  /**
   * Класс корневой группы
   */
  className?: string;
  /**
   * Список ролей, ограничивающий отображение полей
   */
  roles?: string[];
  /**
   * Стиль корневой группы
   */
  style?: React.CSSProperties;
  /**
   * Позволяет загружать данные в компонент
   */
  handler?: OneHandler<Data>;
  /**
   * Вызывается при ошибке в handler
   */
  fallback?: (e: Error) => void;
  /**
   * Коллбек, вызываемый при не прохождении
   * валидации
   */
  invalidity?: (e: string) => void;
  /**
   * Вызываются при фокусировки по филду
   * в компоненте и потере фокуса
   */
  focus?: () => void;
  blur?: () => void;
  /**
   * Вызывается, когда все поля успели отрисоваться
   * в первый раз, после появления формы
   */
  ready?: () => void;
  /**
   * Вызывается после изменения и передает измененный
   * объект прикладному программисту
   */
  change?: (Data: Data, initial: boolean) => void;
  /**
   * Массив полей, выводимый в компоненте
   */
  fields: Field[];
  /**
   * Префикс для формирования ключей элементов
   */
  prefix?: string;
}

export default IOneProps;

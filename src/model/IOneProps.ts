import * as React from 'react';

import IField from '../model/IField';
import IAnything from './IAnything';

export interface IOneProps<Field = IField> {
  /**
   * Позволяет загружать данные в компонент
   */
  handler?: IAnything | (() => IAnything) | (() => Promise<IAnything>);
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
  change?: (IAnything: IAnything, initial?: boolean) => void;
  /**
   * Массив полей, выводимый в компоненте
   */
  fields: Field[];
  /**
   * Префикс для формирования ключей элементов
   */
  prefix?: string;
  /**
   * Плейсхолдер, показываемый во время загрузки данных
   */
  LoadPlaceholder?: null | React.ComponentType;
}

export default IOneProps;

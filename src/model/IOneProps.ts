import * as React from 'react';

import IField from './IField';
import IAnything from './IAnything';

export interface IOneProps<Data = IAnything, Field = IField<Data>> {
  /**
   * Позволяет загружать данные в компонент
   */
  handler?: Data | (() => Data) | (() => Promise<Data>);
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
  /**
   * Плейсхолдер, показываемый во время загрузки данных
   */
  LoadPlaceholder?: null | React.ComponentType;
}

export default IOneProps;

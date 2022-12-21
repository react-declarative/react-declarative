import React from 'react';

import IField from './IField';
import IEntity from './IEntity';
import IAnything from './IAnything';
import IOneApi from './IOneApi';

import { ISlotFactoryContext } from '../components/One/components/SlotFactory';
import { SxProps } from '@mui/material';

type DataOrNull<Data = IAnything> = Data | null;

export type OneHandler<Data = IAnything> = Data | (() => DataOrNull<Data>) | (() => Promise<DataOrNull<Data>>) | null;

export interface IOneProps<Data = IAnything, Payload = IAnything, Field = IField<Data, Payload>> {
  /**
   * Ссылка на объект API
   */
  apiRef?: React.Ref<IOneApi>;
  /**
   * Фабрика для создания полей пользователя
   */
  createField?: (entity: IEntity<Data>, currentPath: string) => React.ReactElement;
  /**
   * Класс корневой группы
   */
  className?: string;
  /**
   * Если флаг включен, показываем валидацию до фокусировки по полю
   */
  dirty?: boolean;
  /**
   * Список ролей, ограничивающий отображение полей
   */
  roles?: string[];
  /**
   * Стиль корневой группы
   */
  style?: React.CSSProperties;
  /**
   * SX для корневой группы
   */
  sx?: SxProps;
  /**
   * Позволяет загружать данные в компонент
   */
  handler?: OneHandler<Data>;
  /**
   * Объект, передающийся в пользовательские
   * поля через контекст
   */
  payload?: Payload | (() => Payload);
  /**
   * Вызывается при ошибке в handler
   */
  fallback?: (e: Error) => void;
  /**
   * Коллбек, вызываемый при не прохождении
   * валидации
   */
  invalidity?: (name: string, msg: string, payload: Payload) => void;
  /**
   * Вызываются при фокусировки по филду
   * в компоненте и потере фокуса
   */
  focus?: (name: string, payload: Payload) => void;
  blur?: (name: string, payload: Payload) => void;
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
   * Коллбеки управления отображением
   * состоянием загрузки
   */
  loadStart?: (source: string) => void;
  loadEnd?: (isOk: boolean, source: string) => void;
  /**
   * Отключает ввод данных
   */
  readonly?: boolean;
  /**
   * Слоты для полей ввода
   */
  slots?: Partial<ISlotFactoryContext>;
}

export default IOneProps;

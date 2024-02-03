import React from 'react';

import { SxProps } from '@mui/material';

import IField, { Value } from './IField';
import IEntity from './IEntity';
import IAnything from './IAnything';
import IOneApi from './IOneApi';

import { TSubject } from '../utils/rx/Subject';

import { ISlotFactoryContext } from '../components/One/components/SlotFactory';

type DataOrNull<Data = IAnything> = Data | null;

export type OneHandler<Data = IAnything, Payload = IAnything> = Data | ((payload: Payload) => DataOrNull<Data>) | ((payload: Payload) => Promise<DataOrNull<Data>>) | null;

export interface IOneProps<Data = IAnything, Payload = IAnything, Field = IField<Data, Payload>> {
  /**
   * Ссылка на объект API
   */
  apiRef?: React.Ref<IOneApi>;
  /**
   * Контекст кастомных полей, в отличие от
   * payload доступен к change detection
   */
  context?: Record<string, any>;
  /**
   * Эмиттер для запроса данных
   */
  reloadSubject?: TSubject<void>;
  /**
   * Генерирует плейсхолдеры согласно схеме полей целевого объекта
   */
  withNamedPlaceholders?: boolean;
  /**
   * Эмиттер для перезаписи данных. Вызывает change(data, true)
   */
  changeSubject?: TSubject<Data>;
  /**
   * Эмиттер для изменения данных. Вызывает change(data, false)
   */
  updateSubject?: TSubject<Data>;
  /**
   * Фабрика для создания полей пользователя
   */
  createField?: (entity: IEntity<Data>, currentPath: string) => React.ReactElement;
  /**
   * Фабрика для создания компоновок пользователя
   */
  createLayout?: (entity: IEntity<Data>, children: React.ReactNode, currentPath: string) => React.ReactElement;
  /**
   * Класс корневой группы
   */
  className?: string;
  /**
   * Если флаг включен, показываем валидацию до фокусировки по полю
   */
  dirty?: boolean;
  /**
   * Список бизнес-функций, ограничивающий отображение полей
   */
  features?: string[];
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
  handler?: OneHandler<Data, Payload>;
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
  focus?: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;
  blur?: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;
  /**
   * Коллбек для управления контекстным меню
   */
  menu?: (name: string, action: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;
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
   * Превращает FieldType.Paper в FieldType.Outline
   */
  outlinePaper?: boolean;
  /**
   * Отключает ввод данных
   */
  readonly?: boolean;
  /**
   * Слоты для полей ввода
   */
  slots?: Partial<ISlotFactoryContext>;
  /**
   * Debounce для FieldType.Text
   */
  fieldDebounce?: number;
}

export default IOneProps;


import { TypedField as TypedFieldInternal } from './model/TypedField';
import { IField as IFieldInternal } from './model/IField';
import { IColumn as IColumnInternal } from './model/IColumn';

import { FieldType as FieldTypeInternal } from './model/FieldType';
import { ColumnType as ColumnTypeInternal } from './model/ColumnType';
import { ActionType as ActionTypeInternal } from './model/ActionType';
import { SelectionMode as SelectionModeInternal } from './model/SelectionMode';

import { IListAction as IListActionInternal } from './model/IListProps';
import { IOption as IOptionInternal } from './model/IOption';

import { ListHandler as ListHandlerInternal } from './model/IListProps';
import { OneHandler as OneHandlerInternal } from './model/IOneProps';

import { i18nMap } from './config/i18n';

import "vanilla-autofill-event";

import { useDate, useTime } from './components';
import { useOne, useOneTyped } from './components';

import IAnything from './model/IAnything';
import IRowData from './model/IRowData';

export const FieldType = FieldTypeInternal;
export const ColumnType = ColumnTypeInternal;
export const ActionType = ActionTypeInternal;
export const SelectionMode = SelectionModeInternal;

export type TypedField<Data = IAnything> = TypedFieldInternal<Data>;
export type IField<Data = IAnything> = IFieldInternal<Data>;

export type ListHandler<FilterData = IAnything, RowData extends IRowData = IAnything> = ListHandlerInternal<FilterData, RowData>;
export type OneHandler<Data = IAnything> = OneHandlerInternal<Data>;

export type IListAction = IListActionInternal;
export type IOption = IOptionInternal;
export type IColumn = IColumnInternal;

export type pickOneTypedFn = ReturnType<typeof useOneTyped>;
export type pickOneFn = ReturnType<typeof useOne>;

export type pickDateFn = ReturnType<typeof useDate>;
export type pickTimeFn = ReturnType<typeof useTime>;

export { default as dayjs } from 'dayjs';

export { One, OneTyped } from './components';
export { List, ListTyped } from './components';
export { ModalProvider } from './components';

export { useListProps } from './components';

export { useOne, useOneTyped };
export { useDate, useTime };

export { i18nMap };

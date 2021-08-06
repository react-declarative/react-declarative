
import { TypedField as TypedFieldInternal } from './model/TypedField';
import { IField as IFieldInternal } from './model/IField';
import { IColumn as IColumnInternal } from './model/IColumn';

import { FieldType as FieldTypeInternal } from './model/FieldType';
import { ColumnType as ColumnTypeInternal } from './model/ColumnType';
import { ActionType as ActionTypeInternal } from './model/ActionType';
import { SelectionMode as SelectionModeInternal } from './model/SelectionMode';

import { IListApi as IListApiInternal } from './model/IListApi';

import { IListAction as IListActionInternal } from './model/IListProps';
import { IOption as IOptionInternal } from './model/IOption';

import { 
    IMenuGroup as IMenuGroupInternal,
    IMenuOption as IMenuOptionInternal,
} from './model/IMenuGroup';

import { ListHandler as ListHandlerInternal } from './model/IListProps';
import { OneHandler as OneHandlerInternal } from './model/IOneProps';

import { i18nMap } from './config/i18n';

import "vanilla-autofill-event";

import { useDate, useTime } from './components';
import { useOne, useOneTyped } from './components';
import { useList, useListTyped } from './components';

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
export type IMenuOption = IMenuOptionInternal;
export type IMenuGroup = IMenuGroupInternal;
export type IListApi = IListApiInternal;
export type IOption = IOptionInternal;
export type IColumn = IColumnInternal;

export type pickOneTypedFn = ReturnType<typeof useOneTyped>;
export type pickOneFn = ReturnType<typeof useOne>;

export type pickDateFn = ReturnType<typeof useDate>;
export type pickTimeFn = ReturnType<typeof useTime>;

export type pickListTypedFn = ReturnType<typeof useListTyped>;
export type pickListFn = ReturnType<typeof useList>;

export { default as dayjs } from 'dayjs';

export { One, OneTyped } from './components';
export { List, ListTyped } from './components';
export { ModalProvider } from './components';
export { Scaffold } from './components';

export { useListProps } from './components';

export { useList, useListTyped };
export { useOne, useOneTyped };
export { useDate, useTime };

export { i18nMap };

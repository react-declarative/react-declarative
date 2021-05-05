
import { TypedField as TypedFieldInternal } from './model/TypedField';
import { FieldType as FieldTypeInternal } from './model/FieldType';
import { IField as IFieldInternal } from './model/IField';
import IAnything from './model/IAnything';

import { IListAction as IListActionInternal } from './model/IListProps';
import { IListColumns as IListColumnsInternal } from './model/IListProps';
import { ActionType as ActionTypeInternal } from './model/IListProps';

export const FieldType = FieldTypeInternal;
export const ActionType = ActionTypeInternal;

export type TypedField<Data = IAnything> = TypedFieldInternal<Data>;
export type IField<Data = IAnything> = IFieldInternal<Data>;

export type IListAction<Data = IAnything> = IListActionInternal<Data>;
export type IListColumns = IListColumnsInternal;

export { One, OneTyped } from './components';
export { List, ListTyped } from './components';

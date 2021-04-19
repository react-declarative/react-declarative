
import { TypedField as TypedFieldInternal } from './model/TypedField';
import { FieldType as FieldTypeInternal } from './model/FieldType';
import { IField as IFieldInternal } from './model/IField';
import IAnything from './model/IAnything';

export const FieldType = FieldTypeInternal;
export type TypedField<Data = IAnything> = TypedFieldInternal<Data>;
export type IField<Data = IAnything> = IFieldInternal<Data>;

export { One, OneTyped } from './components';

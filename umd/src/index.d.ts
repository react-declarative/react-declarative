
/// <reference path="./react-declarative.d.ts"/>

import {
    One as OneDefault,
    OneTyped as OneTypedDefault,
    FieldType as FieldTypeDefault,
    IField as  IFieldDefault,
    TypedField as TypedFieldDefault
} from 'react-declarative';

declare global {

    export namespace declarative {
        
        export const One: typeof OneDefault;
        export const OneTyped: typeof OneTypedDefault;
        export const FieldType: typeof FieldTypeDefault;

        export type IField = IFieldDefault;
        export type TypedField = TypedFieldDefault;

    } // namespace declarative

} // declare global

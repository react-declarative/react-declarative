
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

import { ListHandlerPagination as ListHandlerPaginationInternal } from './model/IListProps';
import { ListHandlerSortModel as ListHandlerSortModelInternal } from './model/IListProps';

import { ListHandlerResult as ListHandlerResultInternal } from './model/IListProps';
import { ListHandler as ListHandlerInternal } from './model/IListProps';
import { OneHandler as OneHandlerInternal } from './model/IOneProps';

import { i18nMap } from './config/i18n';

import "vanilla-autofill-event";

import { useConfirm } from './components';
import { useDate, useTime } from './components';
import { useOne, useOneTyped } from './components';
import { useList, useListTyped } from './components';

import IAnything from './model/IAnything';
import IRowData from './model/IRowData';

import ISwitchItemInternal from './components/Switch/model/ISwitchItem';
export type ISwitchItem = ISwitchItemInternal;

export const FieldType = FieldTypeInternal;
export const ColumnType = ColumnTypeInternal;
export const ActionType = ActionTypeInternal;
export const SelectionMode = SelectionModeInternal;

export type TypedField<Data = IAnything> = TypedFieldInternal<Data>;
export type IField<Data = IAnything> = IFieldInternal<Data>;

export type ListHandler<FilterData = IAnything, RowData extends IRowData = IAnything> = ListHandlerInternal<FilterData, RowData>;
export type ListHandlerResult<RowData extends IRowData = IAnything> = ListHandlerResultInternal<RowData>;
export type OneHandler<Data = IAnything> = OneHandlerInternal<Data>;

export type ListHandlerPagination = ListHandlerPaginationInternal;
export type ListHandlerSortModel = ListHandlerSortModelInternal;

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

export type pickConfirmFn = ReturnType<typeof useConfirm>;

export { default as dayjs } from 'dayjs';

export { AutoSizer } from './components/common/AutoSizer';

export { List, ListTyped } from './components';
export { One, OneTyped } from './components';

export { ModalProvider } from './components';
export { SlotFactory } from './components';
export { Breadcrumbs } from './components';
export { Scaffold } from './components';
export { Switch } from './components';

export { useListProps } from './components';

export { useList, useListTyped };
export { useOne, useOneTyped };
export { useDate, useTime };
export { useConfirm };

export { i18nMap };

import { ICheckBoxSlot as ICheckBoxSlotInternal } from './slots/CheckBoxSlot';
import { IComboSlot as IComboSlotInternal } from './slots/ComboSlot';
import { IItemsSlot as IItemsSlotInternal } from './slots/ItemsSlot';
import { ILineSlot as ILineSlotInternal } from './slots/LineSlot';
import { IProgressSlot as IProgressSlotInternal } from './slots/ProgressSlot';
import { IRadioSlot as IRadioSlotInternal } from './slots/RadioSlot';
import { IRatingSlot as IRatingSlotInternal } from './slots/RatingSlot';
import { ISliderSlot as ISliderSlotInternal } from './slots/SliderSlot';
import { ISwitchSlot as ISwitchSlotInternal } from './slots/SwitchSlot';
import { ITextSlot as ITextSlotInternal } from './slots/TextSlot';
import { ITypographySlot as ITypographySlotInternal } from './slots/TypographySlot';

export type ICheckBoxSlot = ICheckBoxSlotInternal;
export type IComboSlot = IComboSlotInternal;
export type IItemsSlot = IItemsSlotInternal;
export type ILineSlot = ILineSlotInternal;
export type IProgressSlot = IProgressSlotInternal;
export type IRadioSlot = IRadioSlotInternal;
export type IRatingSlot = IRatingSlotInternal;
export type ISliderSlot = ISliderSlotInternal;
export type ISwitchSlot = ISwitchSlotInternal;
export type ITextSlot = ITextSlotInternal;
export type ITypographySlot = ITypographySlotInternal;

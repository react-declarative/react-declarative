import { TypedField as TypedFieldInternal } from './model/TypedField';
import { IField as IFieldInternal } from './model/IField';
import { IColumn as IColumnInternal } from './model/IColumn';

import { IApiPaginatorParams as IApiPaginatorParamsInternal } from './components/List/api/useApiPaginator';
import { IStaticPaginatorParams as IStaticPaginatorParamsInternal } from './components/List/api/useStaticPaginator';
import { IApiHandlerParams as IApiHandlerParamsInternal } from './components/One/api/useApiHandler';

export type IListApiPaginatorParams = IApiPaginatorParamsInternal;
export type IListStaticPaginatorParams = IStaticPaginatorParamsInternal;
export type IOneApiHandlerParams = IApiHandlerParamsInternal;

import { FieldType as FieldTypeInternal } from './model/FieldType';
import { ColumnType as ColumnTypeInternal } from './model/ColumnType';
import { ActionType as ActionTypeInternal } from './model/ActionType';
import { SelectionMode as SelectionModeInternal } from './model/SelectionMode';

import { IListApi as IListApiInternal } from './model/IListApi';

import { IListAction as IListActionInternal } from './model/IListProps';
import { IListChip as IListChipInternal } from './model/IListProps';
import { IListRowAction as IListRowActionInternal } from './model/IListRowAction';
import { IOption as IOptionInternal } from './model/IOption';

import { serviceManager as serviceManagerInternal } from './helpers/serviceManager';
export const provide = serviceManagerInternal.registerCreator;
export const inject = serviceManagerInternal.inject;
export const serviceManager = serviceManagerInternal;

import { 
    IMenuGroup as IMenuGroupInternal,
    IMenuOption as IMenuOptionInternal,
} from './model/IMenuGroup';

import { ListHandlerPagination as ListHandlerPaginationInternal } from './model/IListProps';
import { ListHandlerSortModel as ListHandlerSortModelInternal } from './model/IListProps';
import { ListHandlerChips as ListHandlerChipsInternal } from './model/IListProps';

import { ListHandlerResult as ListHandlerResultInternal } from './model/IListProps';
import { ListHandler as ListHandlerInternal } from './model/IListProps';
import { OneHandler as OneHandlerInternal } from './model/IOneProps';

import { useList } from './hooks/useList';
import { useModal } from './components/ModalProvider';
import { useConfirm } from './hooks/useConfirm';
import { useDate } from './hooks/useDate';
import { useTime } from './hooks/useTime';
import { useOne } from './hooks/useOne';
import { useOneTyped } from './hooks/useOne';

import IAnything from './model/IAnything';
import IRowData, { RowId } from './model/IRowData';

export type { IRowData, RowId };

import { ISwitchItem as ISwitchItemInternal } from './components';

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
export type ListHandlerSortModel<RowData extends IRowData = IAnything> = ListHandlerSortModelInternal<RowData>;
export type ListHandlerChips<RowData extends IRowData = IAnything> = ListHandlerChipsInternal<RowData>;

export type IListRowAction<RowData extends IRowData = IAnything>  = IListRowActionInternal<RowData>;
export type IListChip<RowData extends IRowData = IAnything> = IListChipInternal<RowData>;
export type IListAction  = IListActionInternal;

export type IMenuOption = IMenuOptionInternal;
export type IMenuGroup = IMenuGroupInternal;
export type IListApi = IListApiInternal;
export type IOption = IOptionInternal;
export type IColumn = IColumnInternal;

export type pickOneTypedFn = ReturnType<typeof useOneTyped>;
export type pickOneFn = ReturnType<typeof useOne>;

export type pickDateFn = ReturnType<typeof useDate>;
export type pickTimeFn = ReturnType<typeof useTime>;

export type pickListFn = ReturnType<typeof useList>;

export type pickConfirmFn = ReturnType<typeof useConfirm>;

export { default as dayjs } from 'dayjs';

export { ConstraintView } from './components';
export { ScrollView } from './components';
export { AutoSizer } from './components';
export { FetchView } from './components';
export { FadeView } from './components';
export { ActionMenu } from './components';
export { Async } from './components';
export { If } from './components';

export { List, ListTyped } from './components';
export { One, OneTyped } from './components';

export { Translate } from './components';
export { register as registerTr } from './components/Translate';

export { ModalProvider } from './components';
export { OneSlotFactory, OneDefaultSlots } from './components';
export { ListSlotFactory, ListDefaultSlots } from './components';
export { Breadcrumbs } from './components';
export { Scaffold } from './components';
export { Switch } from './components';

export { useStaticPaginator } from './components';
export { useLastPagination } from './components';
export { useApiPaginator } from './components';

export { useStaticHandler } from './components';
export { usePreventLeave } from './components';
export { useApiHandler } from './components';

export { useListProps, useListSelection } from './components';

export { useOne, useOneTyped };
export { useDate, useTime };
export { useConfirm };
export { useModal };
export { useList };

import { ICheckBoxSlot as ICheckBoxSlotInternal } from './components';
import { IComboSlot as IComboSlotInternal } from './components';
import { IItemsSlot as IItemsSlotInternal } from './components';
import { ILineSlot as ILineSlotInternal } from './components';
import { IProgressSlot as IProgressSlotInternal } from './components';
import { IRadioSlot as IRadioSlotInternal } from './components';
import { IRatingSlot as IRatingSlotInternal } from './components';
import { ISliderSlot as ISliderSlotInternal } from './components';
import { ISwitchSlot as ISwitchSlotInternal } from './components';
import { ITextSlot as ITextSlotInternal } from './components';
import { ITypographySlot as ITypographySlotInternal } from './components';

import { IBodyRowSlot as IBodyRowSlotInternal } from './components';
import { ICheckboxCellSlot as ICheckboxCellSlotInternal } from './components';
import { ICommonCellSlot as ICommonCellSlotInternal } from './components';
import { IHeadRowSlot as IHeadRowSlotInternal } from './components';

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

export type IBodyRowSlot = IBodyRowSlotInternal;
export type ICheckboxCellSlot = ICheckboxCellSlotInternal;
export type ICommonCellSlot = ICommonCellSlotInternal;
export type IHeadRowSlot = IHeadRowSlotInternal;

export { createProvider } from './utils/createProvider';
export { formatText } from './utils/formatText';
export { roundTicks } from './utils/roundTicks';
export { singleshot } from './utils/singleshot';

export { formatAmount, nbsp, thinsp } from './utils/formatAmount';

export { createCustomTag } from './utils/createCustomTag';
export { mainColor } from './utils/mainColor';
export { cacheSrc } from './utils/cacheSrc';

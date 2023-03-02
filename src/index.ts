import { TypedField as TypedFieldInternal } from './model/TypedField';
import { IField as IFieldInternal } from './model/IField';
import { IEntity as IEntityInternal } from './model/IEntity';
import { IManaged as IManagedInternal } from './model/IManaged';
import { IColumn as IColumnInternal } from './model/IColumn';
import { ITab as ITabInternal } from './model/ITab';

import { IApiPaginatorParams as IApiPaginatorParamsInternal } from './components/List/api/useApiPaginator';
import { IArrayPaginatorParams as IArrayPaginatorParamsInternal } from './components/List/api/useArrayPaginator';
import { IApiHandlerParams as IApiHandlerParamsInternal } from './components/One/api/useApiHandler';

export type IListApiPaginatorParams = IApiPaginatorParamsInternal;
export type ILastArrayPaginatorParams = IArrayPaginatorParamsInternal;
export type IOneApiHandlerParams = IApiHandlerParamsInternal;

import { FieldType as FieldTypeInternal } from './model/FieldType';
import { ColumnType as ColumnTypeInternal } from './model/ColumnType';
import { ActionType as ActionTypeInternal } from './model/ActionType';
import { SelectionMode as SelectionModeInternal } from './model/SelectionMode';

import { IListApi as IListApiInternal } from './model/IListApi';
import { IOneApi as IOneApiInternal } from './model/IOneApi';

import { IListOperation as IListOperationInternal } from './model/IListOperation';
import { IListRowAction as IListRowActionInternal } from './model/IListRowAction';
import { IListAction as IListActionInternal } from './model/IListProps';
import { IListChip as IListChipInternal } from './model/IListProps';
import { IOption as IOptionInternal } from './model/IOption';

import { IBreadcrumbsOption as IBreadcrumbsOptionInternal } from './model/IBreadcrumbsOption';

export { createServiceManager } from './helpers/serviceManager';
export { serviceManager } from './helpers/serviceManager';

import { IService as IServiceInternal } from './helpers/serviceManager';
export type IService = IServiceInternal;

export { createRouteItemManager } from './helpers/routeManager';
export { createRouteParamsManager } from './helpers/routeManager';

export { useRouteItem } from './hooks/useRouteItem';
export { useRouteParams } from './hooks/useRouteParams';

export { RouteManager } from './helpers/routeManager';

export { prefetch } from './helpers/serviceManager';
export { unload } from './helpers/serviceManager';

export { provide } from './helpers/serviceManager';
export { inject } from './helpers/serviceManager';

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

import { useActualCallback } from './hooks/useActualCallback';
import { useActualValue } from './hooks/useActualValue';
import { useActualState } from './hooks/useActualState';
import { useRenderWaiter } from './hooks/useRenderWaiter';

import { useAsyncAction } from './hooks/useAsyncAction';
import { useMediaContext } from './hooks/useMediaContext';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useChangeSubject } from './hooks/useChangeSubject';
import { useReloadTrigger } from './hooks/useReloadTrigger';
import { useSingleton } from './hooks/useSingleton';
import { useBehaviorSubject } from './hooks/useBehaviorSubject';
import { useSubject } from './hooks/useSubject';
import { useChange } from './hooks/useChange';

import { useModel } from './hooks/useModel';
import { useEntity } from './hooks/useEntity';
import { useListEditor } from './hooks/useListEditor';
import { useMediaStreamBuilder } from './hooks/useMediaStreamBuilder';
import { useCollection } from './hooks/useCollection';
// import { useModelBinding } from './hooks/useModelBinding';
// import { useEntityBinding } from './hooks/useEntityBinding';
// import { useCollectionBinding } from './hooks/useCollectionBinding';
import { useRequestSnackbar } from './hooks/useRequestSnackbar';

import { useModal } from './components/ModalProvider';
import { useSnack } from './components/SnackProvider';
import { useSize } from './components/SizeProvider';

import { useList } from './hooks/useList';
import { useFile } from './hooks/useFile';
import { useConfirm } from './hooks/useConfirm';
import { usePrompt } from './hooks/usePrompt';
import { useDate } from './hooks/useDate';
import { useTime } from './hooks/useTime';
import { useOne } from './hooks/useOne';
import { useOneTyped } from './hooks/useOne';

import { useSearchParams } from './hooks/useSearchParams';
import { useSearchState } from './hooks/useSearchState';

export { useSearchParams };
export { useSearchState };

import IAnything from './model/IAnything';
import IRowData, { RowId } from './model/IRowData';

export type { IRowData, RowId };

import { ISwitchItem as ISwitchItemInternal } from './components';
import { IActionFilter as IActionFilterInternal } from './components';
import { IActionTrigger as IActionTriggerInternal } from './components';
import { IScaffoldOption as IScaffoldOptionInternal  } from './components';

export type ISwitchItem = ISwitchItemInternal;
export type IActionFilter = IActionFilterInternal;
export type IActionTrigger<Data extends any = any> = IActionTriggerInternal<Data>;

export const FieldType = FieldTypeInternal;
export const ColumnType = ColumnTypeInternal;
export const ActionType = ActionTypeInternal;
export const SelectionMode = SelectionModeInternal;

export type TypedField<Data = IAnything, Payload = IAnything> = TypedFieldInternal<Data, Payload>;
export type IField<Data = IAnything, Payload = IAnything> = IFieldInternal<Data, Payload>;
export type IFieldEntity<Data = IAnything, Payload = IAnything> = IEntityInternal<Data, Payload>;
export type IFieldManaged<Data = IAnything, Value = IAnything> = IManagedInternal<Data, Value>;
export type ITab<T extends unknown = string> = ITabInternal<T>;

export type ListHandler<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> = ListHandlerInternal<FilterData, RowData>;
export type ListHandlerResult<RowData extends IRowData = IAnything> = ListHandlerResultInternal<RowData>;
export type OneHandler<Data = IAnything> = OneHandlerInternal<Data>;

export type ListHandlerPagination = ListHandlerPaginationInternal;
export type ListHandlerSortModel<RowData extends IRowData = IAnything> = ListHandlerSortModelInternal<RowData>;
export type ListHandlerChips<RowData extends IRowData = IAnything> = ListHandlerChipsInternal<RowData>;

export type IListRowAction<RowData extends IRowData = IAnything>  = IListRowActionInternal<RowData>;
export type IListChip<RowData extends IRowData = IAnything> = IListChipInternal<RowData>;
export type IListOperation = IListOperationInternal;
export type IListAction  = IListActionInternal;

export type IListApi<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> = IListApiInternal<FilterData, RowData>;
export type IOneApi<Data = IAnything> = IOneApiInternal<Data>;

export type IMenuOption = IMenuOptionInternal;
export type IMenuGroup = IMenuGroupInternal;
export type IOption = IOptionInternal;
export type IColumn<RowData extends IRowData = any, Payload = any> = IColumnInternal<RowData, Payload>;

import {
    TGridSort as TGridSortInternal,
    IGridColumn as IGridColumnInternal,
    IGridAction as IGridActionInternal,
} from './components';

export type TGridSort<RowData extends IRowData = any> = TGridSortInternal<RowData>;
export type IGridColumn<RowData extends IRowData = any> = IGridColumnInternal<RowData>;
export type IGridAction<RowData extends IRowData = any> = IGridActionInternal<RowData>;

export type IBreadcrumbsOption = IBreadcrumbsOptionInternal;
export type IScaffoldOption = IScaffoldOptionInternal;

export type pickOneTypedFn = ReturnType<typeof useOneTyped>;
export type pickOneFn = ReturnType<typeof useOne>;

export type pickDateFn = ReturnType<typeof useDate>;
export type pickTimeFn = ReturnType<typeof useTime>;

export type pickListFn = ReturnType<typeof useList>;

export type pickConfirmFn = ReturnType<typeof useConfirm>;

export type pickPromptFn = ReturnType<typeof usePrompt>;

export { default as dayjs } from 'dayjs';

export { ConstraintView } from './components';
export { DragDropView } from './components';
export { ScrollView } from './components';
export { ScaleView } from './components';
export { FetchView } from './components';
export { FadeView } from './components';
export { TabsView } from './components';
export { WaitView } from './components';
export { PingView } from './components';
export { OfflineView } from './components';
export { RevealView } from './components';
export { SecretView } from './components';
export { PortalView } from './components';
export { RecordView } from './components';
export { ErrorView } from './components';
export { AuthView } from './components';
export { InfiniteView } from './components';
export { VirtualView, VIRTUAL_VIEW_ROOT, VIRTUAL_VIEW_CHILD } from './components';

import { recordToExcelExport } from './components/RecordView';
export { recordToExcelExport };

export { ErrorBoundary } from './components';

export { AutoSizer } from './components';

export { ActionStopIcon } from './components';
export { ActionTrigger } from './components';
export { ActionFilter } from './components';
export { ActionButton } from './components';
export { ActionToggle } from './components';
export { ActionMenu } from './components';
export { ActionIcon } from './components';
export { ActionModal, useActionModal, useActionModalTyped } from './components';

export { Async } from './components';
export { If } from './components';

export { List, ListTyped } from './components';
export { One, OneTyped } from './components';

export { Translate } from './components';
export { register as registerTr } from './components/Translate';

export { ModalProvider } from './components';
export { SizeProvider } from './components';
export { SnackProvider } from './components';

import { IScaffold2Option as IScaffold2OptionInternal } from './components/Scaffold2';
import { IScaffold2Action as IScaffold2ActionInternal } from './components/Scaffold2';
import { IScaffold2Group as IScaffold2GroupInternal } from './components/Scaffold2';
import { IScaffold2Tab as IScaffold2TabInternal } from './components/Scaffold2';

export type IScaffold2Action<T = any> = IScaffold2ActionInternal<T>;
export type IScaffold2Group<T = any> = IScaffold2GroupInternal<T>;
export type IScaffold2Option<T = any> = IScaffold2OptionInternal<T>;
export type IScaffold2Tab<T = any> = IScaffold2TabInternal<T>;

export { Scaffold } from './components';
export { Scaffold2 } from './components';

export { Countdown } from './components';
export { Search } from './components';
export { Grid } from './components';
export { Copy } from './components';

export { OneSlotFactory, OneDefaultSlots } from './components';
export { ListSlotFactory, ListDefaultSlots } from './components';
export { Breadcrumbs } from './components';
export { Switch } from './components';
export { NoSsr } from './components';

export { OtherComboSlot } from './components';
export { OtherItemsSlot } from './components';

export { useCachedPaginator } from './components';
export { useArrayPaginator } from './components';
export { useApiPaginator } from './components';

export { useLastPagination } from './components';
export { useQueryPagination } from './components';

export { useStaticHandler } from './components';
export { usePreventLeave } from './components';
export { useLocalHandler } from './components';
export { useApiHandler } from './components';

export { useTabsHashstate } from './components';

export { createField, makeField } from './components';

export { useListProps, useListCachedRows } from './components';
export { useOneProps, useOneState } from './components';

export { useActualCallback };
export { useActualValue };
export { useActualState };
export { useRenderWaiter };

export { useChangeSubject };
export { useReloadTrigger };

export { useAsyncAction };
export { useMediaContext };
export { useAudioPlayer };

export { useBehaviorSubject };
export { useSingleton };
export { useSubject };
export { useChange };

export { useModel };
export { useEntity };
export { useListEditor };
export { useCollection };
export { useMediaStreamBuilder };
// export { useModelBinding };
// export { useEntityBinding };
// export { useCollectionBinding };
export { useRequestSnackbar };

export { useOne, useOneTyped };
export { useDate, useTime };
export { useConfirm };
export { usePrompt };
export { useSnack };
export { useModal };
export { useSize };
export { useList };
export { useFile };

import { IOnePublicProps as IOnePublicPropsInternal } from './model/IOnePublicProps';
export type IOnePublicProps<Data = IAnything, Field extends IField<Data> = IField<Data>> = IOnePublicPropsInternal<Data, Field>;

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

import { IActionAddSlot as IActionAddSlotInternal } from './components';
import { IActionFabSlot as IActionFabSlotInternal } from './components';
import { IActionMenuSlot as IActionMenuSlotInternal } from './components';
import { IBodyRowSlot as IBodyRowSlotInternal } from './components';
import { ICheckboxCellSlot as ICheckboxCellSlotInternal } from './components';
import { ICommonCellSlot as ICommonCellSlotInternal } from './components';
import { IHeadRowSlot as IHeadRowSlotInternal } from './components';
import { IActionListSlot as IActionListSlotInternal } from './components';
import { IChipListSlot as IChipListSlotInternal } from './components';
import { IFilterListSlot as IFilterListSlotInternal } from './components';
import { ISearchSlot as ISearchSlotInternal } from './components';
import { IOperationListSlot as IOperationListSlotInternal } from './components';

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

export type IActionAddSlot = IActionAddSlotInternal;
export type IActionFabSlot = IActionFabSlotInternal;
export type IActionMenuSlot = IActionMenuSlotInternal;
export type IBodyRowSlot = IBodyRowSlotInternal;
export type ICheckboxCellSlot = ICheckboxCellSlotInternal;
export type ICommonCellSlot = ICommonCellSlotInternal;
export type IHeadRowSlot = IHeadRowSlotInternal;
export type IActionListSlot = IActionListSlotInternal;
export type IChipListSlot = IChipListSlotInternal;
export type IFilterListSlot = IFilterListSlotInternal;
export type ISearchSlot = ISearchSlotInternal;
export type IOperationListSlot = IOperationListSlotInternal;

export { getRouteParams } from './utils/getRouteParams';
export { getRouteItem } from './utils/getRouteItem';

export { getElementFromXPath } from './utils/getElementFromXPath';
export { getXPathFromElement } from './utils/getXPathFromElement';

export { arrays } from './utils/arrays';
export { objects } from './utils/objects';

export { FetchError, fetchApi } from './utils/fetchApi';

export { createValueProvider } from './utils/createValueProvider';
export { createStateProvider } from './utils/createStateProvider';

export { formatText } from './utils/formatText';
export { roundTicks } from './utils/roundTicks';
export { wordForm } from './utils/wordForm';

export { singleshot } from './utils/hof/singleshot';
export { cancelable, CANCELED_SYMBOL as CANCELED_PROMISE_SYMBOL } from './utils/hof/cancelable';
export { debounce } from './utils/hof/debounce';
export { queued } from './utils/hof/queued';
export { cached } from './utils/hof/cached';

export { BehaviorSubject } from './utils/rx/BehaviorSubject';
export { EventEmitter } from './utils/rx/EventEmitter';
export { Subject } from './utils/rx/Subject';

import TSubjectInternal from './model/TSubject';

export type TSubject<Data = void> = TSubjectInternal<Data>;

import TBehaviorSubjectInternal from './model/TBehaviorSubject';

export type TBehaviorSubject<Data = unknown> = TBehaviorSubjectInternal<Data>;

export { getErrorMessage } from './utils/getErrorMessage';

import { IEntityAdapter as IEntityAdapterInternal, IEntity as IMvvmEntity } from './utils/mvvm/Entity';
import { ICollectionAdapter as ICollectionAdapterInternal } from './utils/mvvm/Collection';
import { IModelAdapter as IModelAdapterInternal } from './utils/mvvm/Model';

export type ICollectionAdapter<T extends IMvvmEntity = any> = ICollectionAdapterInternal<T>;
export type IEntityAdapter<T extends IMvvmEntity = any> = IEntityAdapterInternal<T>;
export type IModelAdapter<T extends {} = any> = IModelAdapterInternal<T>;

export { Collection, EntityNotFoundError } from './utils/mvvm/Collection';
export { Entity } from './utils/mvvm/Entity';
export { Model } from './utils/mvvm/Model';

export { formatAmount } from './utils/formatAmount';

export { createWindowHistory } from './utils/createWindowHistory';
export { createLsManager } from './utils/createLsManager';
export { createSsManager } from './utils/createSsManager';
export { createCustomTag } from './utils/createCustomTag';
export { createWebComponent } from './utils/createWebComponent';

export { mainColor } from './utils/mainColor';
export { cacheSrc } from './utils/cacheSrc';

export { parseBase64Json, stringifyBase64Json } from './utils/base64Json';
export { parseAsciiParams, serializeAsciiParams } from './utils/asciiParams';
export { fromBytes32, toBytes32 } from './utils/asciiParams';

import * as typoInternal from './utils/typo';
import * as datetimeInternal from './utils/datetime';

export const typo = { ...typoInternal };
export const datetime = { ...datetimeInternal };

export { compose } from './utils/compose';

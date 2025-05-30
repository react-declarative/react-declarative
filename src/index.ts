import "./polyfills";

export { SMALL_SIZE_REQUEST, LARGE_SIZE_REQUEST } from './components';

export { ISize } from './model/ISize';

import { TypedField as TypedFieldInternal } from './model/TypedField';
import { IValidation as IValidationInternal } from './model/IValidation';
import { IInvalidField as IInvalidFieldInternal } from './model/IInvalidField';
import { IField as IFieldInternal } from './model/IField';
import { IEntity as IEntityInternal } from './model/IEntity';
import { IManaged as IManagedInternal } from './model/IManaged';
import { IColumn as IColumnInternal } from './model/IColumn';

import { IApiPaginatorParams as IApiPaginatorParamsInternal } from './components/List/api/useApiPaginator';
import { IArrayPaginatorParams as IArrayPaginatorParamsInternal } from './components/List/api/useArrayPaginator';

/**
 * The given TypeScript code is a modular project structure where functionalities are broken into distinct and reusable parts.
 *
 * The code imports certain modules (files) and then exports some of the classes, hooks, functions, or types defined in these modules for other parts of the application to use.
 *
 * Here are some parts explained:
 *
 * **Imports**
 *
 * Modules are being imported from various locations in the application. Structures like classes, interfaces, and functions are imported. For example:
 *
 * ```typescript
 * import { TypedField as TypedFieldInternal } from './model/TypedField';
 * import { useModal } from './components/ModalProvider';
 * ```
 *
 * **Exports**
 *
 * The code exports some of the imported structures, making them available to be used in other parts of the application. For instance:
 *
 * ```typescript
 * export type IOneApiHandlerParams<Data = any>  = IApiHandlerParamsInternal<Data>;
 * export { useColumnConfig } from './components/List';
 * ```
 *
 * **Type Aliases**
 *
 * The code also creates several type aliases that create a new name for an existing type. For example:
 *
 * ```typescript
 * export type IService = IServiceInternal;
 * ```
 *
 * In the above line, `IService` is now an alias for `IServiceInternal`.
 *
 * **Re-importing and Renaming**
 *
 * Some features like hooks or types are re-imported with more application-appropriate naming. The `as` keyword is used to rename the imports:
 *
 * ```typescript
 * import { IField as IFieldInternal } from './model/IField';
 * ```
 *
 * In this line, `IField` from `./model/IField` is imported and renamed as `IFieldInternal`.
 *
 * Overall, this file seems to act like an intermediary that collects, organizes, restructures, and then re-exports various structures that are used across the application.
 */
export { useColumnConfig } from './components/List';

import { IApiHandlerParams as IApiHandlerParamsInternal } from './components/One/api/useApiHandler';

export type IListApiPaginatorParams<FilterData extends {} = IAnything, RowData extends IRowData = IAnything>  = IApiPaginatorParamsInternal<FilterData, RowData>;
export type ILastArrayPaginatorParams<FilterData extends {} = IAnything, RowData extends IRowData = IAnything>  = IArrayPaginatorParamsInternal<FilterData, RowData>;
export type IOneApiHandlerParams<Data = any>  = IApiHandlerParamsInternal<Data>;

export { TileMode } from './components';

export { FieldType } from './model/FieldType';
export { ColumnType } from './model/ColumnType';
export { ActionType } from './model/ActionType';
export { SelectionMode } from './model/SelectionMode';

import { IListApi as IListApiInternal } from './model/IListApi';
import { IOneApi as IOneApiInternal } from './model/IOneApi';

import { IListOperation as IListOperationInternal } from './model/IListOperation';
import { IListRowAction as IListRowActionInternal } from './model/IListRowAction';
import { IListAction as IListActionInternal } from './model/IListProps';
import { IListChip as IListChipInternal } from './model/IListProps';
import { IOption as IOptionInternal } from './model/IOption';

import { IBreadcrumbsOption as IBreadcrumbsOptionInternal } from './model/IBreadcrumbsOption';

export { createServiceManager } from './helpers/serviceManager';
export { websocketManager } from './helpers/websocketManager';
export { serviceManager } from './helpers/serviceManager';

import { IService as IServiceInternal } from './helpers/serviceManager';
export type IService = IServiceInternal;

export { createRouteItemManager } from './helpers/routeManager';
export { createRouteParamsManager } from './helpers/routeManager';

export { ArraySet } from './helpers/ArraySet';

export { usePreventAutofill } from './hooks/usePreventAutofill';
export { useManagedCursor } from './hooks/useManagedCursor';
export { useItemModal } from './hooks/useItemModal';
export { useOneInput } from './hooks/useOneInput';
export { useContextMenu } from './hooks/useContextMenu';
export { useChangeDelay } from './hooks/useChangeDelay';

export { useSingleshot } from './hooks/useSingleshot';
export { useOnce } from './hooks/useOnce';

export { useRouteItem } from './hooks/useRouteItem';
export { useRouteParams } from './hooks/useRouteParams';

export { useWatchChanges } from './hooks/useWatchChanges';
export { useForceUpdate } from './hooks/useForceUpdate';

export { useUserAgent } from './hooks/useUserAgent';
export { usePointer } from './hooks/usePointer';

export { useLocalHistory } from './hooks/useLocalHistory';

export { RouteManager } from './helpers/routeManager';
export { toRouteUrl } from './utils/toRouteUrl';
export { parseRouteUrl } from './utils/parseRouteUrl';

export { prefetch } from './helpers/serviceManager';
export { unload } from './helpers/serviceManager';

export { provide } from './helpers/serviceManager';
export { inject } from './helpers/serviceManager';
export { waitForProvide } from './helpers/serviceManager';

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
import { useActualRef } from './hooks/useActualRef';
import { useRenderWaiter } from './hooks/useRenderWaiter';
import { useOneArray, oneArrayIncludes, isOneArray, toOneArray } from './hooks/useOneArray';

import { useAsyncProgress } from './hooks/useAsyncProgress';
import { useAsyncAction } from './hooks/useAsyncAction';
import { useAsyncValue } from './hooks/useAsyncValue';
import { useSinglerunAction } from './hooks/useSinglerunAction';
import { useQueuedAction } from './hooks/useQueuedAction';
import { useMediaContext } from './hooks/useMediaContext';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useChangeSubject } from './hooks/useChangeSubject';
import { useDeepChangeSubject } from './hooks/useDeepChangeSubject';
import { useReloadTrigger } from './hooks/useReloadTrigger';
import { useSingleton } from './hooks/useSingleton';
import { useBehaviorSubject } from './hooks/useBehaviorSubject';
import { useSubscription } from './hooks/useSubscription';
import { useSubjectValue } from './hooks/useSubjectValue';
import { useElementSize } from './hooks/useElementSize';
import { useWindowSize } from './hooks/useWindowSize';
import { useSubject } from './hooks/useSubject';
import { useChange } from './hooks/useChange';

export { useConstraint } from './components';

import { useModel } from './hooks/useModel';
import { useEntity } from './hooks/useEntity';
import { useListEditor } from './hooks/useListEditor';
import { useMediaStreamBuilder } from './hooks/useMediaStreamBuilder';
import { useCollection } from './hooks/useCollection';
// import { useModelBinding } from './hooks/useModelBinding';
// import { useEntityBinding } from './hooks/useEntityBinding';
// import { useCollectionBinding } from './hooks/useCollectionBinding';
import { useRequestSnackbar } from './hooks/useRequestSnackbar';
import { useActionSnackbar } from './hooks/useActionSnackbar';

import { useModal } from './components/ModalProvider';
import { useSnack } from './components/SnackProvider';
import { useSize } from './components/SizeProvider';

export { ModalManagerProvider, useModalManager } from './components/ModalManager';
export type { IModal } from './components/ModalManager';

import { useList } from './hooks/useList';
import { useFile } from './hooks/useFile';
import { useConfirm } from './hooks/useConfirm';
import { usePrompt } from './hooks/usePrompt';
import { useAlert } from './hooks/useAlert';
import { useDate } from './hooks/useDate';
import { useTime } from './hooks/useTime';
import { useOne } from './hooks/useOne';
import { useOneTyped } from './hooks/useOne';

import { useSearchParams } from './hooks/useSearchParams';
import { useSearchState } from './hooks/useSearchState';

export { useSearchParams };
export { useSearchState };

export { useElementSize };
export { useWindowSize };

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

export type TypedField<Data = IAnything, Payload = IAnything> = TypedFieldInternal<Data, Payload>;
export type IField<Data = IAnything, Payload = IAnything> = IFieldInternal<Data, Payload>;
export type IFieldEntity<Data = IAnything, Payload = IAnything> = IEntityInternal<Data, Payload>;
export type IFieldManaged<Data = IAnything, Value = IAnything> = IManagedInternal<Data, Value>;
export type IInvalidField<Data = IAnything, Payload = IAnything> = IInvalidFieldInternal<Data, Payload>;
export type IValidation = IValidationInternal;

export type ListHandler<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> = ListHandlerInternal<FilterData, RowData>;
export type ListHandlerResult<RowData extends IRowData = IAnything> = ListHandlerResultInternal<RowData>;
export type OneHandler<Data = IAnything> = OneHandlerInternal<Data>;

export type ListHandlerPagination = ListHandlerPaginationInternal;
export type ListHandlerSortModel<RowData extends IRowData = IAnything> = ListHandlerSortModelInternal<RowData>;
export type ListHandlerChips<RowData extends IRowData = IAnything> = ListHandlerChipsInternal<RowData>;

export type IListRowAction<RowData extends IRowData = IAnything>  = IListRowActionInternal<RowData>;
export type IListChip<RowData extends IRowData = IAnything> = IListChipInternal<RowData>;
export type IListOperation<Data extends IRowData = any> = IListOperationInternal<Data>;
export type IListAction<Data extends IRowData = any>  = IListActionInternal<Data>;

export type IListApi<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> = IListApiInternal<FilterData, RowData>;
export type IOneApi<Data = IAnything> = IOneApiInternal<Data>;

export type IMenuOption<Data = any> = IMenuOptionInternal<Data>;
export type IMenuGroup<Data = any> = IMenuGroupInternal<Data>;
export type IOption<Payload = any> = IOptionInternal<Payload>;
export type IColumn<FilterData extends {} = IAnything, RowData extends IRowData = any, Payload = any> = IColumnInternal<FilterData, RowData, Payload>;

import {
    TGridSort as TGridSortInternal,
    IGridColumn as IGridColumnInternal,
    IGridAction as IGridActionInternal,
    ITile as ITileInternal
} from './components';

export type ITile<RowData extends IRowData = any, Payload extends IAnything = IAnything> = ITileInternal<RowData, Payload>;

export type TGridSort<RowData extends IRowData = any> = TGridSortInternal<RowData>;
export type IGridColumn<RowData extends IRowData = any, Payload = any> = IGridColumnInternal<RowData, Payload>;
export type IGridAction<RowData extends IRowData = any> = IGridActionInternal<RowData>;

export type IBreadcrumbsOption<Data = any> = IBreadcrumbsOptionInternal<Data>;
export type IScaffoldOption<Data = any> = IScaffoldOptionInternal<Data>;

export type pickOneTypedFn = ReturnType<typeof useOneTyped>;
export type pickOneFn = ReturnType<typeof useOne>;

export type pickDateFn = ReturnType<typeof useDate>;
export type pickTimeFn = ReturnType<typeof useTime>;

export type pickListFn = ReturnType<typeof useList>;

export type pickConfirmFn = ReturnType<typeof useConfirm>;

export type pickPromptFn = ReturnType<typeof usePrompt>;


export type pickAlertFn = ReturnType<typeof useAlert>;

export { default as dayjs } from 'dayjs';

export { DocumentView } from './components';
export { ScrollTopView } from './components';
export { OutletView } from './components';
export { AlertView } from './components';
export { ImageView } from './components';
export { ConstraintView } from './components';
export { DragDropView } from './components';
export { DropAreaView } from './components';
export { FilesView } from './components';
export { PaperView } from './components';
export { ScrollView } from './components';
export { ScaleView } from './components';
export { FetchView } from './components';
export { FadeView } from './components';
export { WaitView } from './components';
export { PingView } from './components';
export { OfflineView } from './components';
export { RevealView } from './components';
export { SecretView } from './components';
export { PortalView } from './components';
export { ReloadView } from './components';
export { RecordView } from './components';
export { CardView } from './components';
export { HtmlView } from './components';
export { ErrorView } from './components';
export { AuthView } from './components';
export { LoaderView } from './components';
export { VisibilityView } from './components';
export { FeatureView } from './components';
export { CalendarView } from './components';
export { InfiniteView } from './components';
export { TabsView } from './components';
export { RoiView, ICord } from './components';
export { SearchView, ISearchItem } from './components';
export { WizardView, WizardNavigation, WizardContainer } from './components';
export { VirtualView, VIRTUAL_VIEW_ROOT, VIRTUAL_VIEW_CHILD } from './components';
export { ChatView, ChatController } from './components';

import { IBoard as IBoardInternal } from './components';
import { IBoardColumn as IBoardColumnInternal } from './components';
import { IBoardItem as IBoardItemInternal } from './components';
import { IBoardRow as IBoardRowInternal } from './components';

export { IBoardDivider } from './components';

export type IBoardColumn<Data = any, Payload = any> = IBoardColumnInternal<Data, Payload>;
export type IBoard<Data = any, Payload = any> = IBoardInternal<Data, Payload>;
export type IBoardRow<Data = any, Payload = any> = IBoardRowInternal<Data, Payload>;
export type IBoardItem<Data = any> = IBoardItemInternal<Data>;

export { KanbanView } from './components';

import { TreeView, ITreeViewNode as ITreeViewNodeInternal } from './components';
import { GridView } from './components';

export type ITreeViewNode = ITreeViewNodeInternal;
export { TreeView };
export { GridView };

export { ColorButton } from './components';

import { ICardViewItemData } from './components/CardView';
import { ICardViewAction as ICardViewActionInternal } from './components/CardView';
import { ICardViewOperation as ICardViewOperationInternal } from './components/CardView';

export type ICardViewAction<Data extends ICardViewItemData = any> = ICardViewActionInternal<Data>;
export type ICardViewOperation<Data extends ICardViewItemData = any> = ICardViewOperationInternal<Data>;

import { ICalendarTile as ICalendarTileInternal } from './components/CalendarView';
import { ICalendarItem as ICalendarItemInternal } from './components/CalendarView';
import { ICalendarRequest as ICalendarRequestInternal } from './components/CalendarView';

export type ICalendarTile<Data = IAnything, Payload = IAnything> = ICalendarTileInternal<Data, Payload>;
export type ICalendarItem<Data = IAnything, Payload = IAnything> = ICalendarItemInternal<Data, Payload>;
export type ICalendarRequest<Payload = IAnything> = ICalendarRequestInternal<Payload>;

import { IFeatureGroup as IFeatureGroupInternal } from './components/FeatureView';
import { IFeature as IFeatureInternal } from './components/FeatureView';

export type IFeatureGroup<Data = IAnything, Payload = IAnything> = IFeatureGroupInternal<Data, Payload>;
export type IFeature<Data = IAnything, Payload = IAnything> = IFeatureInternal<Data, Payload>;
export { FeatureType } from './components/FeatureView';

export { IVisibilityGroup } from './components/VisibilityView';

import { recordToExcelExport, RECORD_NEVER_VALUE } from './components/RecordView';
export { recordToExcelExport, RECORD_NEVER_VALUE };

export { ErrorBoundary } from './components';

export { AutoSizer } from './components';

export { ActionStopIcon } from './components';
export { ActionTrigger } from './components';
export { ActionFilter } from './components';
export { ActionButton } from './components';
export { ActionToggle } from './components';
export { ActionGroup } from './components';
export { ActionMenu } from './components';
export { ActionIcon } from './components';
export { ActionFab } from './components';
export { ActionChip } from './components';

export { ActionBounce, ActionState } from './components';

export { ActionModal, useActionModal, useActionModalTyped } from './components';
export { SearchModal, useSearchModal, useSearchModalTyped } from './components';

import { IMasterDetailOption as IMasterDetailOptionInternal } from './components';
import { MasterDetailMode as MasterDetailModeInternal } from './components';

export type IMasterDetailOption<Payload = any> = IMasterDetailOptionInternal<Payload>;
export const MasterDetailMode = MasterDetailModeInternal;

import { IOutlet as IOutletInternal, IOutletProps as IOutletPropsInternal, IOutletModalProps as IOutletModalPropsInternal, IOutletModal as IOutletModalInternal } from './components';

export type IOutlet<Data = any, Payload = any, Params = any> = IOutletInternal<Data, Payload, Params>;
export type IOutletModal<Data = any, Payload = any, Params = any> = IOutletModalInternal<Data, Payload, Params>;
export type IOutletProps<Data = any, Payload = any, Params = any> = IOutletPropsInternal<Data, Payload, Params>;
export type IOutletModalProps<Data = any, Payload = any, Params = any> = IOutletModalPropsInternal<Data, Payload, Params>;

import { IWizardOutlet as IWizardOutletInternal, IWizardOutletProps as IWizardOutletPropsInternal, IWizardStep as IWizardStepInternal, IWizardModal as IWizardModalInternal, IWizardModalProps as IWizardModalPropsInternal } from './components';

export type IWizardStep = IWizardStepInternal;
export type IWizardOutlet<Data = any, Payload = any> = IWizardOutletInternal<Data, Payload>;
export type IWizardOutletProps<Data = any, Payload = any> = IWizardOutletPropsInternal<Data, Payload>;

export type IWizardModalProps<Data = any, Payload = any> = IWizardModalPropsInternal<Data, Payload>;
export type IWizardModal<Data = any, Payload = any> = IWizardModalInternal<Data, Payload>;

import { ITabsOutlet as ITabsOutletInternal, IWizardOutletProps as ITabsOutletPropsInternal, ITabsStep as ITabsStepInternal, ITabsModal as ITabsModalInternal, ITabsModalProps as ITabsModalPropsInternal } from './components';

export type ITabsStep = ITabsStepInternal;
export type ITabsOutlet<Data = any, Payload = any> = ITabsOutletInternal<Data, Payload>;
export type ITabsOutletProps<Data = any, Payload = any> = ITabsOutletPropsInternal<Data, Payload>;

export type ITabsModalProps<Data = any, Payload = any> = ITabsModalPropsInternal<Data, Payload>;
export type ITabsModal<Data = any, Payload = any> = ITabsModalInternal<Data, Payload>;

export { MasterDetail, MASTER_DETAIL_HEADER, MASTER_DETAIL_ROOT } from './components';

export { Sheet } from './components';

export { Async } from './components';
export { If } from './components';

export { OneIcon } from './components';
export { OneButton } from './components';
export { List, ListTyped } from './components';
export { One, OneTyped, OneConfig } from './components';

export { ClassicChipListSlot } from './components';
export { ClassicFilterListSlot } from './components';
export { DialogFilterListSlot } from './components';
export { ModalFilterListSlot } from './components';
export { ModernChipListSlot } from './components';
export { DenseFilterListSlot } from './components';
export { DenseSearchSlot } from './components';

export { ListActionAdd } from './components';
export { ListActionFab } from './components';
export { ListActionMenu } from './components';

export { ListRules } from './components';

import { Translate } from './components';

export { Translate };
export const registerTr = Translate.install;

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

import { IScaffold3Option as IScaffold3OptionInternal } from './components/Scaffold3';
import { IScaffold3Action as IScaffold3ActionInternal } from './components/Scaffold3';
import { IScaffold3Group as IScaffold3GroupInternal } from './components/Scaffold3';
import { IScaffold3Tab as IScaffold3TabInternal } from './components/Scaffold3';

export type IScaffold3Action<T = any> = IScaffold3ActionInternal<T>;
export type IScaffold3Group<T = any> = IScaffold3GroupInternal<T>;
export type IScaffold3Option<T = any> = IScaffold3OptionInternal<T>;
export type IScaffold3Tab<T = any> = IScaffold3TabInternal<T>;

import { Breadcrumbs2Type as Breadcrumbs2TypeInternal } from './components/Breadcrumbs2';
import { IBreadcrumbs2Action as IBreadcrumbs2ActionInternal } from './components/Breadcrumbs2';
import { IBreadcrumbs2Option as IBreadcrumbs2OptionInternal } from './components/Breadcrumbs2';

export const Breadcrumbs2Type = Breadcrumbs2TypeInternal;
export type IBreadcrumbs2Action<Data = any> = IBreadcrumbs2ActionInternal<Data>;
export type IBreadcrumbs2Option<Data = any> = IBreadcrumbs2OptionInternal<Data>;

export { Scaffold } from './components';
export { Scaffold2 } from './components';
export { Scaffold3 } from './components';

export { Countdown } from './components';
export { Spinner } from './components'; 
export { Grid } from './components';
export { Tile, TileCheckbox } from './components';
export { CopyButton } from './components';
export { Copy } from './components';
export { Chip } from './components';
export { Map } from './components';

export { OneSlotFactory, OneDefaultSlots } from './components';

export { isBaseline, isBaselineSimple, isBaselineForRoot } from './components';

export { ListSlotFactory, ListDefaultSlots } from './components';
export { Breadcrumbs } from './components';
export { Breadcrumbs2 } from './components';
export { Switch } from './components';
export { Center } from './components';
export { Square } from './components';
export { SubjectBinding } from './components';
export { Dot } from './components';
export { ScrollAdjust } from './components';
export { NoSsr } from './components';

export { OtherComboSlot } from './components';
export { OtherItemsSlot } from './components';

export { useHistoryStatePagination } from './components';
export { useCachedPaginator } from './components';
export { useArrayPaginator } from './components';
export { useListSelection } from './components';
export { useListAction } from './components';
export { useListModalSort } from './components';
export { useListDropFilters } from './components';
export { useListStateAction } from './components';
export { useListUpsertManager } from './components';
export { useListToggleHandler } from './components';
export { useListIntersectionConnect } from './components';
export { useListIntersectionStorage } from './components';
export { useListIntersectionListen } from './components';
export { useApiPaginator } from './components';

export { useCursorPaginator } from './components';
export { useOffsetPaginator } from './components';
export { useGridAction } from './components';
export { useGridSelection } from './components';
export { useGridProps } from './components';

export { useLastPagination } from './components';
export { useQueryPagination } from './components';

export { usePreventNavigate } from './components';
export { useStaticHandler } from './components';
export { usePreventLeave } from './components';
export { usePreventAction } from './components';
export { useLocalHandler } from './components';
export { useApiHandler } from './components';
export { useFeatureView } from './components';
export { useVisibilityView } from './components';
export { useFilesView } from './components';

export { useOutletModal } from './components';
export { useWizardModal } from './components';
export { useTabsModal } from "./components";

export { createField, makeField } from './components';
export { createLayout, makeLayout } from './components';

export { useListProps, useListCachedRows, useListPayload, useListChips, useListReload, useListSelectionState } from './components';
export { useOneProps, useOneState, useOnePayload, useOneFeatures, useOneRadio, useOneContext, useOneMenu } from './components';

export { useActualCallback };
export { useActualValue };
export { useActualState };
export { useActualRef };
export { useRenderWaiter };
export { useOneArray };

export { oneArrayIncludes };
export { isOneArray };
export { toOneArray };

export { useChangeSubject };
export { useDeepChangeSubject };
export { useReloadTrigger };

export { useSinglerunAction };
export { useAsyncAction };
export { useAsyncValue };
export { useAsyncProgress };
export { useQueuedAction };
export { useMediaContext };
export { useAudioPlayer };

export { useBehaviorSubject };
export { useSubjectValue };
export { useSubscription };
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
export { useActionSnackbar };

export { useOne, useOneTyped };
export { useDate, useTime };
export { useConfirm };
export { usePrompt };
export { useAlert };
export { useSnack };
export { useModal };
export { useSize };
export { useList };
export { useFile };

import { IOnePublicProps as IOnePublicPropsInternal } from './model/IOnePublicProps';
export type IOnePublicProps<Data = IAnything, Field extends IField<Data> = IField<Data>> = IOnePublicPropsInternal<Data, Field>;

import { ICheckBoxSlot as ICheckBoxSlotInternal } from './components';
import { IYesNoSlot as IYesNoSlotInternal } from './components';
import { IComboSlot as IComboSlotInternal } from './components';
import { IItemsSlot as IItemsSlotInternal } from './components';
import { ILineSlot as ILineSlotInternal } from './components';
import { IProgressSlot as IProgressSlotInternal } from './components';
import { IRadioSlot as IRadioSlotInternal } from './components';
import { IDateSlot as IDateSlotInternal } from './components';
import { ITimeSlot as ITimeSlotInternal } from './components';
import { IFileSlot as IFileSlotInternal } from './components';
import { IDictSlot as IDictSlotInternal } from './components';
import { ITreeSlot as ITreeSlotInternal } from './components';
import { IChooseSlot as IChooseSlotIntetnal } from './components';
import { IRatingSlot as IRatingSlotInternal } from './components';
import { ISliderSlot as ISliderSlotInternal } from './components';
import { ISwitchSlot as ISwitchSlotInternal } from './components';
import { ITextSlot as ITextSlotInternal } from './components';
import { ICompleteSlot as ICompleteSlotInternal } from './components';
import { ITypographySlot as ITypographySlotInternal } from './components';
import { IButtonSlot as IButtonSlotInternal } from './components';

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

import { IPositionActionListSlot as IPositionActionListSlotInternal } from './model/IListProps';

import { History as HistoryInternal } from './model/History';
export type History = HistoryInternal;

export type ICheckBoxSlot = ICheckBoxSlotInternal;
export type IButtonSlot = IButtonSlotInternal;
export type IComboSlot = IComboSlotInternal;
export type IYesNoSlot = IYesNoSlotInternal;
export type IItemsSlot = IItemsSlotInternal;
export type ILineSlot = ILineSlotInternal;
export type IProgressSlot = IProgressSlotInternal;
export type IRadioSlot = IRadioSlotInternal;
export type IRatingSlot = IRatingSlotInternal;
export type ISliderSlot = ISliderSlotInternal;
export type ISwitchSlot = ISwitchSlotInternal;
export type ITextSlot = ITextSlotInternal;
export type IDateSlot = IDateSlotInternal;
export type ITimeSlot = ITimeSlotInternal;
export type IFileSlot = IFileSlotInternal;
export type IDictSlot = IDictSlotInternal;
export type ITreeSlot = ITreeSlotInternal;
export type IChooseSlot = IChooseSlotIntetnal;
export type ITypographySlot = ITypographySlotInternal;
export type ICompleteSlot = ICompleteSlotInternal;

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
export type IPositionActionListSlot = IPositionActionListSlotInternal;

import type { IAwaiter as IAwaiterInternal } from './utils/createAwaiter';

export type IAwaiter<T extends IAnything> = IAwaiterInternal<T>;

export { list2grid } from './utils/list2grid';
export { openBlank } from './utils/openBlank';
export { createDict } from './utils/createDict';
export { createAwaiter } from './utils/createAwaiter';
export { createPointer } from './utils/oop/Pointer';
export { copyToClipboard } from './utils/copyToClipboard';
export { downloadBlank } from './utils/downloadBlank';
export { removeSubstring } from './utils/removeSubstring';
export { randomString } from './utils/randomString';
export { chooseFile } from './utils/chooseFile';
export { loadScript } from './utils/loadScript';
export { reloadPage } from './utils/reloadPage';
export { compareFulltext } from './utils/compareFulltext';
export { promiseState, promiseValue } from './utils/promiseState';
export { chooseMultipleFiles } from './utils/chooseMultipleFiles';
export { preventBrowserHistorySwipeGestures } from './utils/preventBrowserHistorySwipeGestures';
export { errorData } from './utils/errorData';
export { getMediaContext } from './utils/getMediaContext';

export { getRouteParams } from './utils/getRouteParams';
export { getRouteItem } from './utils/getRouteItem';

export { getElementFromXPath } from './utils/getElementFromXPath';
export { getXPathFromElement } from './utils/getXPathFromElement';

export { arrays } from './utils/arrays';
export { objects } from './utils/objects';

export { compareArray } from './utils/compareArray';
export { isObject } from './utils/isObject';

export { FetchError, fetchApi } from './utils/fetchApi';

export { createValueProvider } from './utils/createValueProvider';
export { createStateProvider } from './utils/createStateProvider';

export { createSsStateProvider } from './utils/createSsStateProvider';
export { createLsStateProvider } from './utils/createLsStateProvider';

export { normalizeText } from './utils/normalizeText';
export { formatText } from './utils/formatText';
export { roundTicks } from './utils/roundTicks';
export { wordForm } from './utils/wordForm';

export { scaleRect, createScaleRect } from './utils/scaleRect';
export { scaleToSize, createScaleToSize } from './utils/scaleToSize';

export { timeout, TIMEOUT_SYMBOL } from './utils/hof/timeout';
export { waitForNext } from './utils/hof/waitForNext';

export { obsolete } from './utils/hof/obsolete';
export { singleshot } from './utils/hof/singleshot';
export { singletick } from './utils/hof/singletick';
export { afterinit } from './utils/hof/afterinit';
export { execpool } from './utils/hof/execpool';
export { retry } from './utils/hof/retry';
export { singlerun, Task } from './utils/hof/singlerun';
export { cancelable, CANCELED_SYMBOL as CANCELED_PROMISE_SYMBOL } from './utils/hof/cancelable';
export { debounce } from './utils/hof/debounce';
export { queued } from './utils/hof/queued';
export { lock } from './utils/hof/lock';
export { cached } from './utils/hof/cached';
export { memoize } from './utils/hof/memoize';
export { trycatch } from './utils/hof/trycatch';
export { ttl } from './utils/hof/ttl';

export { sleep } from './utils/sleep';
export { deepFlat } from './utils/deepFlat';

export { BehaviorSubject } from './utils/rx/BehaviorSubject';
export { EventEmitter } from './utils/rx/EventEmitter';
export { Observer } from './utils/rx/Observer';
export { Operator } from './utils/rx/Operator';
export { Subject } from './utils/rx/Subject';
export { Source } from './utils/rx/Source';

export { has } from './utils/math/has';
export { and } from './utils/math/and';
export { or } from './utils/math/or';
export { not } from './utils/math/not';
export { match } from './utils/math/match';

export { first } from './utils/math/first';
export { join } from './utils/math/join';
export { last } from './utils/math/last';
export { truely } from './utils/math/truely';

export { getAvailableFields } from './utils/getAvailableFields';
export { getInitialData } from './utils/getInitialData';
export { getFilterCount } from './utils/getFilterCount';
export { getInvalidFields } from './utils/getInvalidFields';
export { getFieldsError } from './utils/getFieldsError';
export { getFieldVariant } from './utils/getFieldVariant';

export { isInvalidFieldData } from './utils/isInvalidFieldData';

export { flatArray } from './utils/flatArray';
export { removeExtraSpaces } from './utils/removeExtraSpaces';
export { replaceSubstring } from './utils/replaceSubstring';

import TSubjectInternal from './model/TSubject';
import TBehaviorSubjectInternal from './model/TBehaviorSubject';
import TObserverInternal, { TObservable as TObservableInternal } from './model/TObserver';

import TPaginatorInternal from "./model/TPaginator";
import TOffsetPaginatorInternal from "./model/TOffsetPaginator";
import TCursorPaginatorInternal from "./model/TCursorPaginator";

export type TSubject<Data = void> = TSubjectInternal<Data>;
export type TObserver<Data = void> = TObserverInternal<Data>;
export type TObservable<Data = void> = TObservableInternal<Data>;
export type TBehaviorSubject<Data = unknown> = TBehaviorSubjectInternal<Data>;

export type TPaginator<FilterData extends {} = any, RowData extends IRowData = any, Payload = any> = TPaginatorInternal<FilterData, RowData, Payload>;
export type TOffsetPaginator<FilterData extends {} = any, RowData extends IRowData = any, Payload = any> = TOffsetPaginatorInternal<FilterData, RowData, Payload>;
export type TCursorPaginator<FilterData extends {} = any, RowData extends IRowData = any, Payload = any> = TCursorPaginatorInternal<FilterData, RowData, Payload>;

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
export { templateStr } from './utils/templateStr';
export { formatStr } from './utils/formatStr';

export { createWindowHistory } from './utils/createWindowHistory';
export { createManagedHistory } from './utils/createManagedHistory';

export { createLsManager } from './utils/createLsManager';
export { createSsManager } from './utils/createSsManager';
export { createSsSet } from './utils/createSsSet';
export { createLsSet } from './utils/createLsSet';

export { createCustomTag } from './utils/createCustomTag';

export { mainColor } from './utils/mainColor';
export { cacheSrc } from './utils/cacheSrc';

export { parseBase64Json, stringifyBase64Json } from './utils/base64Json';
export { parseAsciiParams, serializeAsciiParams } from './utils/asciiParams';
export { fromBytes32, toBytes32 } from './utils/asciiParams';

import * as typoInternal from './utils/typo';
import * as datetimeInternal from './utils/datetime';
import * as cryptInternal from './utils/crypt';

export { waitForMove } from "./utils/waitForMove";

export const typo = { ...typoInternal };
export const datetime = { ...datetimeInternal };
export const crypt = { ...cryptInternal };

export { compose } from './utils/compose';

export { getMomentStamp, fromMomentStamp } from './utils/getMomentStamp';
export { getTimeStamp, fromTimeStamp } from './utils/getTimeStamp';
export { getGenesisStamp } from './utils/getGenesisStamp';
export { toUtcDate } from './utils/toUtcDate';
export { addUtcOffset, removeUtcOffset } from './utils/addUtcOffset';

export { paginateDocuments } from './api/paginateDocuments';
export { distinctDocuments } from './api/distinctDocuments';
export { resolveDocuments } from './api/resolveDocuments';
export { filterDocuments } from './api/filterDocuments';
export { pickDocuments } from './api/pickDocuments';
export { mapDocuments } from './api/mapDocuments';

export { iterateDocuments } from './api/iterateDocuments';
export { iteratePromise } from './api/iteratePromise';
export { iterateUnion } from './api/iterateUnion';
export { iterateList } from './api/iterateList';

export { useOpenDocument } from './view/useOpenDocument';

export { heavy } from './utils/heavy';

export { useDebounce } from './components/One/hooks/useDebounce';
export { useDebouncedCallback } from './components/One/hooks/useDebouncedCallback';

export { DatePicker } from './components/common/DatePicker/DatePicker';
export { TimePicker } from './components/common/TimePicker/TimePicker';
export { VirtualListBox } from './components/One/components/common/VirtualListBox';

export { MetroView, IMetroGroup, IMetroRoute } from './components';

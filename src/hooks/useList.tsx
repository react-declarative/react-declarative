import * as React from "react";
import { useRef, useEffect } from "react";

import { useModal } from "../components/ModalProvider";

import IColumn from "../model/IColumn";
import IRowData, { RowId } from "../model/IRowData";
import IAnything from "../model/IAnything";
import IListProps from "../model/IListProps";
import SelectionMode from "../model/SelectionMode";

import ListPicker, { IListPickerProps } from "../components/common/ListPicker";

import useActualCallback from "./useActualCallback";
import useActualRef from "./useActualRef";

import Subject from "../utils/rx/Subject";

type Fn<Data = IAnything> = (d: Data[] | null) => void;

interface IParams<RowData extends IRowData = IAnything>
  extends Omit<
    IListPickerProps<RowData>,
    keyof {
      onChange: never;
      selectionMode: never;
      selectedRows: never;
      minHeight: never;
      minWidth: never;
      title: never;
      columns: never;
      open: never;
    }
  > {
  selectionMode?: SelectionMode.Single | SelectionMode.Multiple;
  selectedRows?: IListProps<RowData>["selectedRows"];
  columns: Omit<
    IColumn<RowData>,
    keyof {
      headerName: never;
      width: never;
    }
  >[];
  minHeight?: number;
  minWidth?: number;
  title?: string;
}

interface IState {
  open: boolean;
  title: string;
  minWidth: number;
  minHeight: number;
  selectedRows: RowId[] | null;
}

/**
 * Creates a ListPicker modal with default or custom configurations and returns a promise that resolves with the selected rows.
 *
 * @template RowData - The type of the row data.
 *
 * @param options - The options object.
 * @param options.handler - The handler function to be called when a row is selected.
 * @param options.columns - The columns to be displayed in the ListPicker.
 * @param options.rowActions - The actions to be displayed for each row in the ListPicker.
 * @param options.payload - The payload to be passed to the ListPicker component.
 * @param options.features - The features to be enabled in the ListPicker.
 * @param [options.selectionMode=SelectionMode.Single] - The selection mode for the ListPicker.
 * @param [options.title="Pick item"] - The title of the ListPicker modal.
 * @param [options.minWidth=425] - The minimum width of the ListPicker modal.
 * @param [options.minHeight=375] - The minimum height of the ListPicker modal.
 * @param [options.selectedRows] - The initially selected rows in the ListPicker.
 *
 * @returns - A function that creates and opens the ListPicker modal.
 *
 * @example
 * const listPicker = useList({
 *   handler: handleSelection,
 *   columns: [
 *     { label: 'Name', field: 'name' },
 *     { label: 'Age', field: 'age' }
 *   ],
 *   rowActions: [
 *     { label: 'Edit', action: editRow },
 *     { label: 'Delete', action: deleteRow }
 *   ],
 *   payload: { id: 123 },
 *   features: ['sorting', 'filtering'],
 *   selectionMode: SelectionMode.Multiple,
 *   title: 'Select items',
 *   minWidth: 500,
 *   minHeight: 400,
 *   selectedRows: [1, 2, 3]
 * });
 *
 * listPicker({
 *   title: 'Custom title',
 *   minHeight: 300
 * }).then((selectedRows) => {
 *   // Handle selected rows
 * });
 *
 * @example
 * const listPicker = useList({
 *   handler: handleSelection,
 *   columns: [],
 *   rowActions: [],
 *   payload: null,
 *   features: [],
 *   selectionMode: SelectionMode.Single,
 *   title: 'Pick an item',
 *   minWidth: 425,
 *   minHeight: 375,
 *   selectedRows: null
 * });
 *
 * const selectedRows = await listPicker().toPromise();
 */
export const useList = <RowData extends IRowData = IAnything>({
  handler,
  columns,
  rowActions,
  payload,
  features,
  selectionMode = SelectionMode.Single,
  title: titleDefault = "Pick item",
  minWidth: minWidthDefault = 425,
  minHeight: minHeightDefault = 375,
  selectedRows: selectedRowsDefault,
}: IParams<RowData>) => {
  const getInitialState = useActualCallback(
    (): IState => ({
      title: titleDefault,
      minWidth: minWidthDefault,
      minHeight: minHeightDefault,
      selectedRows: selectedRowsDefault || null,
      open: false,
    })
  );

  const [state$, setState] = useActualRef<IState>(getInitialState);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, title: titleDefault }));
    }
  }, [titleDefault]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, minWidth: minWidthDefault }));
    }
  }, [minWidthDefault]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, minHeight: minHeightDefault }));
    }
  }, [minHeightDefault]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({
        ...prevState,
        selectedRows: selectedRowsDefault || null,
      }));
    }
  }, [selectedRowsDefault]);

  const changeRef = useRef<Fn>();

  const handleChange: Fn = (data) => {
    const { current } = changeRef;
    if (current) {
      current(data);
    }
    setState(getInitialState);
    hideModal();
  };

  const { showModal, hideModal } = useModal(
    () => (
      <ListPicker
        open
        payload={payload}
        features={features}
        selectionMode={selectionMode}
        minHeight={state$.current.minHeight}
        minWidth={state$.current.minWidth}
        title={state$.current.title}
        columns={columns}
        handler={handler}
        selectedRows={state$.current.selectedRows}
        onChange={handleChange}
        rowActions={rowActions}
      />
    ),
    []
  );

  return ({
    title,
    minWidth,
    minHeight,
    selectedRows,
  }: Partial<IParams<RowData>> = {}) =>
    new (class {
      constructor() {
        setState((prevState) => ({
          title: title !== undefined ? title : prevState.title,
          minWidth: minWidth !== undefined ? minWidth : prevState.minWidth,
          minHeight: minHeight !== undefined ? minHeight : prevState.minHeight,
          selectedRows:
            selectedRows !== undefined ? selectedRows : prevState.selectedRows,
          open: true,
        }));
        showModal();
      }
      then = (onData: Fn) => {
        changeRef.current = onData;
      };
      toPromise = async () => {
        const subject = new Subject<RowData[] | null>();
        this.then(subject.next);
        return await subject.toPromise();
      };
    })();
};

export default useList;

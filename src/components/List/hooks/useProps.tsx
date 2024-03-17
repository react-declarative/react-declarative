import * as React from 'react';
import { useContext } from 'react';

import IListProps, { IListCallbacks, IListState } from '../../../model/IListProps';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

import IRowData from '../../../model/IRowData';

/**
 * Represents a context object for providing properties to a component.
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 * @template Payload - The type of payload data.
 * @template Field - The type of field data.
 */
interface IPropContext<
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
    Payload extends IAnything = IAnything,
    Field extends IField = IField<FilterData, Payload>
> extends
    Omit<IListProps<FilterData, RowData, Payload, Field>, keyof {
        limit: never;
        chips: never;
        search: never;
        filterData: never;
        isChooser: never;
        isInfinite: never;
        isCustom: never;
        payload: never;
    }>,
    IListState<FilterData, RowData>,
    IListCallbacks<FilterData, RowData> {
    children: React.ReactNode;
}

const PropContext = React.createContext<IPropContext>(null as never);

/**
 * PropProvider is a higher-order component that provides a PropContext context to its children.
 *
 * @template FilterData - The data type for the filter data.
 * @template RowData - The data type for the row data.
 * @template Payload - The data type for the payload.
 * @template Field - The data type for the field.
 *
 * @param props - The props for the PropProvider component.
 *
 * @returns - The JSX element wrapped with PropContext.Provider.
 */
export const PropProvider = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
    Payload extends IAnything = IAnything,
    Field extends IField = IField<FilterData, Payload>,
>(props: IPropContext<FilterData, RowData, Payload, Field>) => (
    <PropContext.Provider value={props}>
        {props.children}
    </PropContext.Provider>
);

/**
 * Retrieves the current props from the PropContext.
 *
 * @returns The props from the PropContext.
 *
 * @template FilterData The filter data type.
 * @template RowData The row data type.
 * @template Payload The payload type.
 * @template Field The field type.
 */
export const useProps = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
    Payload extends IAnything = IAnything,
    Field extends IField = IField<FilterData, Payload>,
> () => useContext(PropContext) as IPropContext<FilterData, RowData, Payload, Field>;

export default useProps;

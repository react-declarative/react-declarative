import * as React from 'react';
import { useContext } from 'react';

import IListProps, { IListCallbacks, IListState } from '../../../model/IListProps';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

import IRowData from '../../../model/IRowData';

interface IPropContext<
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
    Field extends IField = IField<FilterData>
> extends
    Omit<IListProps<FilterData, RowData, Field>, keyof {
        limit: never;
        chips: never;
        search: never;
        filterData: never;
        isChooser: never;
    }>,
    IListState<FilterData, RowData>,
    IListCallbacks<FilterData, RowData> {
    children: React.ReactNode;
}

const PropContext = React.createContext<IPropContext>(null as never);

export const PropProvider = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
    Field extends IField = IField<FilterData>
>(props: IPropContext<FilterData, RowData, Field>) => (
    <PropContext.Provider value={props}>
        {props.children}
    </PropContext.Provider>
);

export const useProps = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
    Field extends IField = IField<FilterData>
> () => useContext(PropContext) as IPropContext<FilterData, RowData, Field>;

export default useProps;

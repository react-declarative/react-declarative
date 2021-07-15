import * as React from 'react';
import { useContext } from 'react';

import IListProps from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IField from '../../../../model/IField';

import IRowData from '../../../../model/IRowData';

interface IPropContext<
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
    Field extends IField = IField<FilterData>
> extends IListProps<FilterData, RowData, Field> {
    children: React.ReactChild;
}

const PropContext = React.createContext<IPropContext>(null as never);

export const PropProvider = <
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
    Field extends IField = IField<FilterData>
>(props: IPropContext<FilterData, RowData, Field>) => (
    <PropContext.Provider value={props}>
        {props.children}
    </PropContext.Provider>
);

export const useProps = <
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
    Field extends IField = IField<FilterData>
> () => useContext(PropContext) as IPropContext<FilterData, RowData, Field>;

export default PropProvider;

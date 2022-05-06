import * as React from 'react';
import { useMemo } from 'react';
import { useListProps } from '../../../..';

import DisplayMode from "../../../../../../model/DisplayMode";

import { HeadRowSlot, HeadColumn } from '../../../../slots/HeadRowSlot';

import wrapColumns from '../../../../helpers/wrapColumns';

export interface IHeadRowProps {
    fullWidth: number;
    mode: DisplayMode;
}

export const HeadRow = ({
    fullWidth,
    mode,
}: IHeadRowProps) => {

    const {
        columns: listColumns,
    } = useListProps();

    const columns = useMemo(() => wrapColumns({
        columns: listColumns,
        fullWidth,
        mode,
    }), [fullWidth]) as HeadColumn[];

    return (
        <HeadRowSlot
            mode={mode}
            columns={columns}
            fullWidth={fullWidth}
        />
    );

};

export default HeadRow;

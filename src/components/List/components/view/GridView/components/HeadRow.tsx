import * as React from 'react';
import { useMemo } from 'react';

import useProps from '../../../../hooks/useProps';
import useConstraintManager from '../../../../hooks/useConstraintManager';

import DisplayMode from "../../../../../../model/DisplayMode";

import { HeadRowSlot, HeadColumn } from '../../../../slots/HeadRowSlot';

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
    } = useProps();

    const {
        wrapColumns,
    } = useConstraintManager();

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

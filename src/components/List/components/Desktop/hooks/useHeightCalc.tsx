import { useState, useEffect } from 'react';

import IAnything from "../../../../../model/IAnything";
import IColumn from "../../../../../model/IColumn";
import IRowData from "../../../../../model/IRowData";

import createRowHeightCalc from '../createRowHeightCalc';

export const useHeightCalc = <T extends IRowData = IAnything>(columns: IColumn[]) => {
    const [calc] = useState(() => createRowHeightCalc<T>(columns));
    useEffect(() => {
        return () => {
            calc[1]();
        }
    }, []);
    return calc[0];
};

export default useHeightCalc;

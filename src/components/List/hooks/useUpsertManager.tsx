import { useCallback, useEffect, useRef } from 'react';

import useStateAction from "./useStateAction";
import useScrollManager from './useScrollManager';
import useActualState from '../../../hooks/useActualState';

import { IListState } from "../../../model/IListProps";

import TSubject from '../../../model/TSubject';

interface IParams {
    scrollYSubject?: TSubject<number>;
    rows: IListState["rows"];
}

export const useUpsertManager = ({
    scrollYSubject,
    rows: upperRows
}: IParams) => {

    const scrollManager = useScrollManager();
    const stateActionEmitter = useStateAction();
    const keepPaginationRef = useRef(true);

    const [rows$, setRows] = useActualState(upperRows);

    /**
     * Function to handle appending rows to the current state rows.
     * Cleaning rows and resetting data filter if `keepPagination` flag is false
     * @returns
     */
    const handleUpsertRows = useCallback(
        (rows: IListState["rows"]) =>
            setRows((prevRows) => {
                if (!keepPaginationRef.current) {
                    return rows;
                }
                const rowIds = new Set(prevRows.map(({ id }) => id));
                return [...prevRows, ...rows.filter(({ id }) => !rowIds.has(id))]
            }),
        []
    );

    const handleScrollTop = useCallback(() => {
        if (!keepPaginationRef.current) {
            scrollYSubject?.next(0);
            scrollManager.scrollTop();
        }
    }, []);

    useEffect(() => stateActionEmitter.subscribe((action) => {
        if (action.type === "filterdata-changed" && !action.keepPagination) {
            keepPaginationRef.current = false;
        }
        if (action.type === "chips-changed") {
            keepPaginationRef.current = false;
        }
        if (action.type === "rows-changed") {
            handleUpsertRows(action.rows);
            handleScrollTop();
            keepPaginationRef.current = true;
        }
        if (action.type === "search-changed") {
            keepPaginationRef.current = false;
        }
        if (action.type === "sort-changed") {
            keepPaginationRef.current = false;
        }
    }), []);

    return {
        rows: rows$.current,
    };
};

export default useUpsertManager;

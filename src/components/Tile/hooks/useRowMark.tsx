import React from "react";
import { createContext, useContext, useEffect, useMemo } from "react";

import useSubject from "../../../hooks/useSubject";

import memoize from "../../../utils/hof/memoize";

import ITileProps from "../model/ITileProps";

import { redrawAction } from "../action";

const RowMarkContext = createContext<{
  rowMark: Exclude<ITileProps["rowMark"], undefined> & {
    clear(row: any): void;
  };
  rowColor: Exclude<ITileProps["rowColor"], undefined> & {
    clear(row: any): void;
  };
}>(null as never);

export const useRowMark = () => useContext(RowMarkContext);

/**
 * Interface representing the props for the IRowMarkProvider component.
 */
interface IRowMarkProviderProps {
  rowMark: Exclude<ITileProps["rowMark"], undefined>;
  rowColor: Exclude<ITileProps["rowColor"], undefined>;
  rowKey: ITileProps["rowKey"];
  recomputeSubject: ITileProps["recomputeSubject"];
  children: React.ReactNode;
}

/**
 * RowMarkProvider component provides row marks for each row in a table.
 *
 * @param props - The properties passed to the RowMarkProvider component.
 * @param props.children - The child elements to be wrapped by the RowMarkProvider.
 * @param [props.rowKey="id"] - The key used to identify each row in the table.
 * @param props.recomputeSubject - The subject used to trigger recomputation of row marks.
 * @param [props.rowMark=() => ""] - The function used to compute the row mark.
 * @returns The RowMarkProvider component.
 */
export const RowMarkProvider = ({
  children,
  rowKey = "id",
  recomputeSubject: upperRecomputeSubject,
  rowMark: upperRowMark = () => "",
  rowColor: upperRowColor = () => "",
}: IRowMarkProviderProps) => {
  const recomputeSubject = useSubject(upperRecomputeSubject);

  /**
   * Memoizes a function to calculate the row mark.
   *
   * @param rowKey - The function to extract the key from the row.
   * @param upperRowMark - The function to calculate the upper row mark.
   * @returns The memoized row mark value.
   */
  const rowMark = useMemo(
    () => memoize(([row]) => row[rowKey] || row, upperRowMark),
    []
  );

  /**
   * Memoizes a function to calculate the row mark.
   *
   * @param rowKey - The function to extract the key from the row.
   * @param upperRowColor - The function to calculate the upper row mark.
   * @returns The memoized row mark value.
   */
  const rowColor = useMemo(
    () => memoize(([row]) => row[rowKey] || row, upperRowColor),
    []
  );

  useEffect(
    () =>
      recomputeSubject.subscribe(() => {
        rowMark.clear();
        rowColor.clear();
        redrawAction.next();
      }),
    []
  );

  useEffect(
    () => () => {
      rowMark.clear();
      rowColor.clear();
    },
    []
  );

  const value = useMemo(() => ({
    rowMark,
    rowColor,
  }), []);

  return (
    <RowMarkContext.Provider value={value}>
      {children}
    </RowMarkContext.Provider>
  );
};

export default useRowMark;

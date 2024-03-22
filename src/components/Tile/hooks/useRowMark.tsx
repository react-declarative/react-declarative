import React from "react";
import { createContext, useContext, useEffect, useMemo } from "react";

import useSubject from "../../../hooks/useSubject";

import memoize from "../../../utils/hof/memoize";

import ITileProps from "../model/ITileProps";

type RowMark = Exclude<ITileProps["rowMark"], undefined> & {
  clear: (id?: string) => void;
};

const RowMarkContext = createContext<RowMark>(null as never);

export const useRowMark = () => useContext(RowMarkContext);

/**
 * Interface representing the props for the IRowMarkProvider component.
 */
interface IRowMarkProviderProps {
  rowMark: ITileProps["rowMark"];
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
}: IRowMarkProviderProps) => {
  const recomputeSubject = useSubject(upperRecomputeSubject);

  /**
   * Memoizes a function to calculate the row mark.
   *
   * @param {function} rowKey - The function to extract the key from the row.
   * @param {function} upperRowMark - The function to calculate the upper row mark.
   * @returns {any} The memoized row mark value.
   */
  const rowMark = useMemo(
    () => memoize(([row]) => row[rowKey] || row, upperRowMark),
    []
  );

  useEffect(
    () =>
      recomputeSubject.subscribe(() => {
        rowMark.clear();
      }),
    []
  );

  useEffect(
    () => () => {
      rowMark.clear();
    },
    []
  );

  return (
    <RowMarkContext.Provider value={rowMark}>
      {children}
    </RowMarkContext.Provider>
  );
};

export default useRowMark;

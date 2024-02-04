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

interface IRowMarkProviderProps {
  rowMark: ITileProps["rowMark"];
  rowKey: ITileProps["rowKey"];
  recomputeSubject: ITileProps["recomputeSubject"];
  children: React.ReactNode;
}

export const RowMarkProvider = ({
  children,
  rowKey = "id",
  recomputeSubject: upperRecomputeSubject,
  rowMark: upperRowMark = () => "",
}: IRowMarkProviderProps) => {
  const recomputeSubject = useSubject(upperRecomputeSubject);

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

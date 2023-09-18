import * as React from "react";
import { useContext, useMemo, useEffect } from "react";
import { createContext } from "react";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";

interface IContext {
  focusMap: Map<IField, (name: string, payload: IAnything) => void>;
  blurMap: Map<IField, (name: string, payload: IAnything) => void>;
  baselineMap: Map<IField, boolean>;
  fieldsMap: Map<IField[], IField[]>;
  statefullMap: Map<IField[], number>;
}

const CacheContext = createContext<IContext>(null as never);

interface ICacheProviderProps {
  children: React.ReactNode;
}

export const CacheProvider = ({ children }: ICacheProviderProps) => {
  const cacheMap = useMemo((): IContext => {
    const fnMap = Object.create(null);
    Object.assign(fnMap, {
      focusMap: new Map<IField, (name: string, payload: IAnything) => void>(),
      blurMap: new Map<IField, (name: string, payload: IAnything) => void>(),
      baselineMap: new Map<IField, boolean>(),
      fieldsMap: new Map<IField[], IField[]>(),
      statefullMap: new Map<IField[], number>(),
    });
    return fnMap;
  }, []);
  useEffect(() => () => Object.values(cacheMap).forEach((cache) => {
    cache.clear()
  }), []);
  return (
    <CacheContext.Provider value={cacheMap}>
      {children}
    </CacheContext.Provider>
  );
};

export const useOneCache = () => useContext(CacheContext);

export default CacheProvider;

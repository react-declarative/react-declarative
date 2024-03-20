import * as React from "react";
import { useContext, useMemo, useEffect } from "react";
import { createContext } from "react";

import IField from "../../../model/IField";

/**
 * An interface representing a context that holds mappings between fields and their corresponding values.
 *
 * @interface IContext
 */
interface IContext {
  focusMap: Map<IField, IField['focus']>;
  blurMap: Map<IField, IField['blur']>;
  menuMap: Map<IField, IField['menu']>;
  clickMap: Map<IField, IField['click']>;
  baselineMap: Map<IField, boolean>;
  fieldsMap: Map<IField[], IField[]>;
  statefullMap: Map<IField[], number>;
  trMap: Map<IField, IField['tr']>;
  itemListMap: Map<IField, IField['itemList']>;
}

const CacheContext = createContext<IContext>(null as never);

interface ICacheProviderProps {
  children: React.ReactNode;
}

export const CacheProvider = ({ children }: ICacheProviderProps) => {
  const cacheMap = useMemo((): IContext => {
    const fnMap = Object.create(null);
    Object.assign(fnMap, {
      focusMap: new Map<IField, IField['focus']>(),
      blurMap: new Map<IField, IField['blur']>(),
      menuMap: new Map<IField, IField['menu']>(),
      clickMap: new Map<IField, IField['click']>(),
      baselineMap: new Map<IField, boolean>(),
      fieldsMap: new Map<IField[], IField[]>(),
      statefullMap: new Map<IField[], number>(),
      trMap: new Map<IField, IField['tr']>(),
      itemListMap: new Map<IField, IField['shouldUpdateItemList']>(),
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

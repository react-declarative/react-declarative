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

/**
 * Represents the properties for the CacheProvider component.
 */
interface ICacheProviderProps {
  children: React.ReactNode;
}

/**
 * Represents a cache provider used for memoization.
 *
 * @typedef {Object} CacheProvider
 * @property {Object} cacheMap - Represents a cache map used for memoization.
 * @property {Map<IField, IField['focus']>} cacheMap.focusMap - Map for focusing fields.
 * @property {Map<IField, IField['blur']>} cacheMap.blurMap - Map for blurring fields.
 * @property {Map<IField, IField['menu']>} cacheMap.menuMap - Map for field menus.
 * @property {Map<IField, IField['click']>} cacheMap.clickMap - Map for field click events.
 * @property {Map<IField, boolean>} cacheMap.baselineMap - Map for field baselines.
 * @property {Map<IField[], IField[]>} cacheMap.fieldsMap - Map for field arrays.
 * @property {Map<IField[], number>} cacheMap.statefullMap - Map for stateful fields.
 * @property {Map<IField, IField['tr']>} cacheMap.trMap - Map for translational fields.
 * @property {Map<IField, IField['shouldUpdateItemList']>} cacheMap.itemListMap - Map for items list updates.
 */
export const CacheProvider = ({ children }: ICacheProviderProps) => {
  /**
   * Represents a cache map used for memoization.
   *
   * @typedef {Object} CacheMap
   * @property {Map<IField, IField['focus']>} focusMap - Map for focusing fields.
   * @property {Map<IField, IField['blur']>} blurMap - Map for blurring fields.
   * @property {Map<IField, IField['menu']>} menuMap - Map for field menus.
   * @property {Map<IField, IField['click']>} clickMap - Map for field click events.
   * @property {Map<IField, boolean>} baselineMap - Map for field baselines.
   * @property {Map<IField[], IField[]>} fieldsMap - Map for field arrays.
   * @property {Map<IField[], number>} statefullMap - Map for stateful fields.
   * @property {Map<IField, IField['tr']>} trMap - Map for translational fields.
   * @property {Map<IField, IField['shouldUpdateItemList']>} itemListMap - Map for items list updates.
   */
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

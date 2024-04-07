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
 * @property cacheMap - Represents a cache map used for memoization.
 * @property cacheMap.focusMap - Map for focusing fields.
 * @property cacheMap.blurMap - Map for blurring fields.
 * @property cacheMap.menuMap - Map for field menus.
 * @property cacheMap.clickMap - Map for field click events.
 * @property cacheMap.baselineMap - Map for field baselines.
 * @property cacheMap.fieldsMap - Map for field arrays.
 * @property cacheMap.statefullMap - Map for stateful fields.
 * @property cacheMap.trMap - Map for translational fields.
 * @property cacheMap.itemListMap - Map for items list updates.
 */
export const CacheProvider = ({ children }: ICacheProviderProps) => {
  /**
   * Represents a cache map used for memoization.
   *
   * @typedef {Object} CacheMap
   * @property focusMap - Map for focusing fields.
   * @property blurMap - Map for blurring fields.
   * @property menuMap - Map for field menus.
   * @property clickMap - Map for field click events.
   * @property baselineMap - Map for field baselines.
   * @property fieldsMap - Map for field arrays.
   * @property statefullMap - Map for stateful fields.
   * @property trMap - Map for translational fields.
   * @property itemListMap - Map for items list updates.
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

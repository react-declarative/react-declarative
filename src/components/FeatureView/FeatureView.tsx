import * as React from "react";
import { useMemo, useCallback } from "react";

import One from "../One";

import createFeatures from "./helpers/createFeatures";

import IFeatureViewProps from "./model/IFeatureViewProps";

type Data = string[];
type State = Record<string, boolean>;

/**
 * Represents a feature view component.
 *
 * @typedef FeatureView
 * @property changeSubject - The subject of the change.
 * @property outlinePaper - Whether to outline the paper.
 * @property transparentPaper - Whether the paper is transparent.
 * @property className - The CSS class name for the component.
 * @property style - The CSS styles for the component.
 * @property sx - The theme styles for the component.
 * @property data - The data for the features.
 * @property readonly - Whether the component is read-only.
 * @property features - The list of available features.
 * @property expandAll - Whether to expand all features.
 * @property onChange - The function to call when a feature is changed.
 *
 * @returns The rendered component.
 */
export const FeatureView = ({
  changeSubject,
  outlinePaper,
  transparentPaper,
  className,
  style,
  sx,
  data,
  readonly,
  features,
  expandAll,
  onChange,
}: IFeatureViewProps) => {
  const fields = useMemo(() => {
    return createFeatures(features, expandAll);
  }, []);

  /**
   * Calculates the value to be memoized based on the given data.
   *
   * @function
   * @name useMemo
   * @param {Array} data - The data to be used for calculating the value.
   * @returns {Object} - The calculated value.
   * @typedef {Object} State - The state object.
   */
  const value = useMemo(
    () => {
      if (!data) {
        return {};
      }
      return data.reduce(
        (acm, cur) => ({
          ...acm,
          [cur]: true,
        }),
        {} as State
      );
    },
    [data]
  );

  const handler = useCallback(() => value, [data]);

  /**
   * A callback function that handles the change of data.
   *
   * @param {Data} data - The data object to handle.
   * @param {boolean} initial - Indicates whether the change is initial.
   */
  const handleChange = useCallback((data: Data, initial: boolean) => {
    if (data && !initial) {
      const features = Object.entries(data)
        .filter(([_, value]) => !!value)
        .map(([key]) => key);
      onChange && onChange(features);
    }
  }, []);

  return (
    <One<any, any>
      changeSubject={changeSubject}
      className={className}
      style={style}
      sx={sx}
      outlinePaper={outlinePaper}
      transparentPaper={transparentPaper}
      handler={handler}
      change={handleChange}
      fields={fields}
      readonly={readonly}
      payload={{ readonly }}
    />
  );
};

export default FeatureView;

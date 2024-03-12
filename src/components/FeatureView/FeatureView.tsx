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
 * @typedef {Object} FeatureView
 * @property {string} changeSubject - The subject of the change.
 * @property {boolean} outlinePaper - Whether to outline the paper.
 * @property {boolean} transparentPaper - Whether the paper is transparent.
 * @property {string} className - The CSS class name for the component.
 * @property {Object} style - The CSS styles for the component.
 * @property {Object} sx - The theme styles for the component.
 * @property {object[]} data - The data for the features.
 * @property {boolean} readonly - Whether the component is read-only.
 * @property {string[]} features - The list of available features.
 * @property {boolean} expandAll - Whether to expand all features.
 * @property {function} onChange - The function to call when a feature is changed.
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

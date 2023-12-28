import * as React from "react";
import { useMemo, useCallback } from "react";

import One from "../One";

import createFeatures from "./helpers/createFeatures";

import IFeatureViewProps from "./model/IFeatureViewProps";

type Data = string[];
type State = Record<string, boolean>;

export const FeatureView = ({
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
    () =>
      data.reduce(
        (acm, cur) => ({
          ...acm,
          [cur]: true,
        }),
        {} as State
      ),
    []
  );

  const handler = useCallback(() => value, []);

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
      className={className}
      style={style}
      sx={sx}
      handler={handler}
      change={handleChange}
      fields={fields}
      readonly={readonly}
      payload={{ readonly }}
    />
  );
};

export default FeatureView;

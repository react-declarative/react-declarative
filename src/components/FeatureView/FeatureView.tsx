import * as React from "react";
import { useMemo, useCallback } from "react";

import One from "../One";

import createFeatures from "./helpers/createFeatures";

import IFeatureViewProps from "./model/IFeatureViewProps";

type Data = string[];
type State = Record<string, boolean>;

export const FeatureView = ({
  changeSubject,
  outlinePaper,
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
      handler={handler}
      change={handleChange}
      fields={fields}
      readonly={readonly}
      payload={{ readonly }}
    />
  );
};

export default FeatureView;

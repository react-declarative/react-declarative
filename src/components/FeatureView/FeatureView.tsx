import * as React from "react";
import { useMemo } from "react";

import One from "../One";

import createFeatures from "./helpers/createFeatures";

import IAnything from "../../model/IAnything";
import IFeatureViewProps from "./model/IFeatureViewProps";

export const FeatureView = <
  Data extends IAnything = IAnything,
  Payload = IAnything
>({
  readonly,
  features,
  expandAll,
  ...oneProps
}: IFeatureViewProps<Data, Payload>) => {

  const fields = useMemo(() => {
    return createFeatures(features, expandAll);
  }, []);

  return (
    <One<any, any>
      {...oneProps}
      fields={fields}
      readonly={readonly}
      payload={{ readonly }}
    />
  );
};

export default FeatureView;

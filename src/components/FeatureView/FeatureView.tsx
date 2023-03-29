import * as React from "react";
import { useMemo } from "react";

import One from "../One";

import FieldType from "../../model/FieldType";
import IAnything from "../../model/IAnything";
import TypedField from "../../model/TypedField";

import IFeatureViewProps from "./model/IFeatureViewProps";

export const FeatureView = <
  Data extends IAnything = IAnything,
  Payload = IAnything
>({
  features,
  ...oneProps
}: IFeatureViewProps<Data, Payload>) => {

  const fields = useMemo((): TypedField<Data, Payload>[] => {
    return features.map(({ title, expanded = false, children, isVisible }) => ({
      type: FieldType.Expansion,
      fieldRightMargin: "0",
      fieldBottomMargin: "1",
      expansionOpened: expanded,
      isVisible,
      title,
      fields: children.flatMap(
        ({
          name,
          defaultValue = false,
          description = name,
          label = name,
          isDisabled,
        }) => [
          {
            type: FieldType.Switch,
            defaultValue,
            isDisabled,
            name,
            fieldRightMargin: "0",
            title: label,
            fieldBottomMargin: "0",
          },
          {
            type: FieldType.Typography,
            typoVariant: "subtitle2",
            placeholder: description,
            style: {
              opacity: 0.5,
            },
            fieldBottomMargin: "0",
          },
        ]
      ),
    }));
  }, []);

  return (
    <One
        {...oneProps}
        fields={fields}
    />
  );
};

export default FeatureView;

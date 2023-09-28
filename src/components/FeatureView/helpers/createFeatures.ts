import FieldType from "../../../model/FieldType";
import TypedField from "../../../model/TypedField";
import IFeatureGroup from "../model/IFeatureGroup";

import FeatureType from "../model/FeatureType";

import createFeatureItem from "./createFeatureItem";

export const createFeatures = (features: IFeatureGroup[], expandAll = false): TypedField[] =>
  features.map(({ title, expanded = false, children, isVisible, isDisabled }) => ({
    type: FieldType.Expansion,
    fieldRightMargin: "0",
    fieldBottomMargin: "1",
    expansionOpened: expanded || expandAll,
    isVisible,
    isDisabled,
    title,
    fields: children.flatMap(
      ({
        type = FeatureType.Boolean,
        name,
        defaultValue = false,
        description = name,
        label = name,
        isDisabled = () => false,
        isVisible = () => true,
        map,
      }) => [
        createFeatureItem(type, {
          label,
          name,
          defaultValue,
          isDisabled,
          isVisible,
          map,
        }),
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

export default createFeatures;

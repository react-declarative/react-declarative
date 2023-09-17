import FieldType from "../../../model/FieldType";
import TypedField from "../../../model/TypedField";
import IFeatureGroup from "../model/IFeatureGroup";

export const createFeatures = (features: IFeatureGroup[], expandAll = false): TypedField[] =>
  features.map(({ title, expanded = false, children, isVisible }) => ({
    type: FieldType.Expansion,
    fieldRightMargin: "0",
    fieldBottomMargin: "1",
    expansionOpened: expanded || expandAll,
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

export default createFeatures;

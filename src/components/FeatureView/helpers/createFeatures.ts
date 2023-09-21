import FieldType from "../../../model/FieldType";
import TypedField from "../../../model/TypedField";
import IFeatureGroup from "../model/IFeatureGroup";

import or from "../../../utils/math/or";

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
        name,
        defaultValue = false,
        description = name,
        label = name,
        isDisabled = () => false,
        isVisible = () => true,
        map,
      }) => [
        {
          type: FieldType.Switch,
          defaultValue,
          isDisabled: (data, payload) => or(
            isDisabled(data, payload),
            payload.readonly,
          ),
          isVisible,
          map,
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

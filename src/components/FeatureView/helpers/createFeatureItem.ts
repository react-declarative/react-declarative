import FieldType from "../../../model/FieldType";
import IField from "../../../model/IField";
import FeatureType from "../model/FeatureType";
import TypedField from "../../../model/TypedField";

import or from "../../../utils/math/or";

interface IParams {
  defaultValue?: string | boolean;
  isDisabled?: IField["isDisabled"];
  isVisible?: IField["isVisible"];
  map?: IField["map"];
  label: string;
  name: string;
}

export const createFeatureItem = (
  type: FeatureType,
  {
    defaultValue,
    label,
    name,
    isDisabled = () => false,
    isVisible,
    map,
  }: IParams
): TypedField => {
  if (type === FeatureType.Number) {
    return {
      type: FieldType.Div,
      style: {
        display: "inline-grid",
        gridTemplateColumns: "1fr 58px",
        alignItems: "center",
      },
      fields: [
        {
          type: FieldType.Typography,
          fieldRightMargin: "0",
          fieldBottomMargin: "0",
          typoVariant: "body1",
          placeholder: label,
        },
        {
          type: FieldType.Text,
          sx: {
            "& input": {
              fontWeight: "bold",
              textAlign: "center",
            },
          },
          isInvalid(data) {
            if (data[name] === "") {
              return "Required";
            }
            return null;
          },
          inputFormatterAllowed: /^[0-9]/,
          inputFormatterTemplate: "00000",
          name,
          placeholder: "0",
          defaultValue,
          title: "",
        },
      ],
    };
  }
  return {
    type: FieldType.Switch,
    defaultValue,
    isDisabled: (data: any, payload: any) =>
      or(isDisabled(data, payload), payload.readonly),
    isVisible,
    map,
    name,
    fieldRightMargin: "0",
    title: label,
    fieldBottomMargin: "0",
  };
};

export default createFeatureItem;

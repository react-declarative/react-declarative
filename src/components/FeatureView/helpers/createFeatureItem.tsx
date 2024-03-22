import * as React from 'react';

import Typography from "@mui/material/Typography";

import FieldType from "../../../model/FieldType";
import IField from "../../../model/IField";
import FeatureType from "../model/FeatureType";
import TypedField from "../../../model/TypedField";

import or from "../../../utils/math/or";

/**
 * Interface representing parameters for a field.
 * @interface IParams
 */
interface IParams {
  defaultValue?: string | boolean;
  isDisabled?: IField["isDisabled"];
  isVisible?: IField["isVisible"];
  map?: IField["map"];
  label: string;
  name: string;
}

/**
 * Creates a feature item.
 *
 * @param type - The type of the feature.
 * @param params - The parameters for the feature item.
 * @param params.defaultValue - The default value for the feature item.
 * @param params.label - The label for the feature item.
 * @param params.name - The name of the feature item.
 * @param [params.isDisabled=() => false] - The function to determine if the feature item is disabled.
 * @param params.isVisible - Indicates if the feature item is visible.
 * @param params.map - The function to map the feature item's value.
 * @returns The created feature item.
 */
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
        width: '100%',
      },
      fields: [
        {
          type: FieldType.Component,
          element: (data) => (
            <Typography
              variant="body1"
              style={{
                opacity: !data.payload.readonly && !data[name] ? 0.5 : 1.0,
              }}
            >
              {label}
            </Typography>
          ),
        },
        {
          type: FieldType.Text,
          fieldRightMargin: "0",
          fieldBottomMargin: "0",
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
    type: FieldType.Div,
    style: {
      display: "inline-grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      width: '100%',
    },
    fields: [
      {
        type: FieldType.Component,
        element: (data) => (
          <Typography
            variant="body1"
            style={{
              opacity: !data.payload.readonly && !data[name] ? 0.5 : 1.0,
            }}
          >
            {label}
          </Typography>
        ),
      },
      {
        type: FieldType.Switch,
        defaultValue,
        isDisabled: (data: any, payload: any) =>
          or(isDisabled(data, payload), payload.readonly),
        isVisible,
        map,
        name,
        fieldRightMargin: "0",
        title: "",
        fieldBottomMargin: "0",
      },
    ],
  };
};

export default createFeatureItem;

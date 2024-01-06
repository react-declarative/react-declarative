import { alpha } from "@mui/material";

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
      }, idx) => ({
        type: FieldType.Box,
        sx: {
          ...(idx % 2 === 0 && {
            background: (theme) => alpha(
              theme.palette.getContrastText(theme.palette.background.paper),
              0.04
            ),
          }),
          marginLeft: '-16px',
          marginRight: '-16px',
          paddingLeft: '16px',
          paddingRight: '8px',
          ...(idx === children.length - 1 && {
            marginBottom: '-16px',
          }),
          ...(idx === children.length - 1 && children.length === 1 ? {
            paddingBottom: '16px',
          } : {
            paddingBottom: '4px',
          }),
          width: 'calc(100% + 32px) !important',
        },
        fields: [
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
      }),
    ),
  }));

export default createFeatures;

import * as React from 'react';
import { alpha } from "@mui/material";

import Typography from "@mui/material/Typography";

import FieldType from "../../../model/FieldType";
import TypedField from "../../../model/TypedField";
import IFeatureGroup from "../model/IFeatureGroup";

import FeatureType from "../model/FeatureType";

import createFeatureItem from "./createFeatureItem";

/**
 * Creates an array of TypedField objects based on the given array of IFeatureGroup objects.
 *
 * @param features - The array of features to create typed fields for.
 * @param [expandAll=false] - Whether all features should be expanded by default.
 * @returns - The array of typed fields created from the given features.
 */
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
            type: FieldType.Component,
            element: (data: any) => (
              <Typography
                variant="subtitle2"
                sx={{
                  opacity:
                    !data.payload.readonly &&
                    !data[name]
                      ? 0.2
                      : 0.5,
                }}
              >
                {description}
              </Typography>
            ),
          },
        ]
      }),
    ),
  }));

export default createFeatures;

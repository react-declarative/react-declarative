import React from 'react';

import { OneTyped, FieldType, TypedField } from 'react-declarative';

import { Paper, Theme } from '@mui/material';

const fields: TypedField[] = [
  {
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Hero,
        phoneColumns: "12",
        tabletColumns: "12",
        desktopColumns: "3",

        height: "420px",
        desktopRight: "20px",
        phoneBottom: "20px",
        tabletBottom: "20px",

        child: {
          type: FieldType.Component,
          element: () => <Paper/>,
        },
      },
      {
        type: FieldType.Hero,
        phoneColumns: "12",
        tabletColumns: "12",
        desktopColumns: "6",

        height: "420px",
        desktopRight: "20px",
        phoneBottom: "20px",
        tabletBottom: "20px",

        child: {
          type: FieldType.Component,
          element: () => <Paper/>,
        },
      },
      {
        type: FieldType.Group,
        fieldBottomMargin: "1",
        fieldRightMargin: "0",
        phoneColumns: "12",
        tabletColumns: "12",
        desktopColumns: "3",
        fields: [
          {
            type: FieldType.Hero,
            phoneColumns: "12",
            tabletColumns: "6",
            desktopColumns: "12",

            desktopHeight: "220px",
            tabletHeight: "200px",
            phoneHeight: "220px",

            tabletRight: "20px",
            desktopBottom: "20px",
            phoneBottom: "20px",

            child: {
              type: FieldType.Component,
              element: () => <Paper/>,
            },
          },
          {
            type: FieldType.Hero,
            phoneColumns: "12",
            tabletColumns: "6",
            desktopColumns: "12",

            height: "200px",

            child: {
              type: FieldType.Component,
              element: () => <Paper/>,
            },
          },
        ],
      },
    ],
  },
];

export const HeroPage = () => (
    <OneTyped fields={fields} />
);

export default HeroPage;

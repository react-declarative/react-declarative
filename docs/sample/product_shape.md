# Product shape

> Link to [the playground](https://react-declarative-playground.github.io/)

```tsx
import { TypedField, FieldType } from "react-declarative";

import {
  SquareFoot,
  LensOutlined,
  VolumeDown,
  VolumeUp,
} from '@mui/icons-material';

export const fields: TypedField[] = [
  {
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Line,
        title: "Glass Type"
      },
      {
        title: "Bronze",
        columns: "4",
        type: FieldType.Checkbox,
        name: "Bronze"
      },
      {
        title: "Matte",
        columns: "4",
        type: FieldType.Checkbox,
        name: "Matte"
      },
      {
        title: "Lightened",
        type: FieldType.Checkbox,
        columns: "4",
        name: "Lightened"
      },
      {
        title: "Transparent",
        type: FieldType.Checkbox,
        columns: "4",
        name: "Transparent"
      },
      {
        title: "Gray",
        columns: "4",
        type: FieldType.Checkbox,
        name: "Gray"
      },
      {
        type: FieldType.Group,
        fields: [
          {
            type: FieldType.Line,
            title: "Glass Thickness"
          },
          {
            title: "10 mm",
            columns: "4",
            type: FieldType.Radio,
            name: "Glass Thickness",
            radioValue: "10 mm"
          },
          {
            title: "12 mm",
            columns: "4",
            type: FieldType.Radio,
            name: "Glass Thickness",
            radioValue: "12 mm"
          },
          {
            title: "3 mm",
            columns: "4",
            type: FieldType.Radio,
            name: "Glass Thickness",
            radioValue: "3 mm"
          },
          {
            title: "4 mm",
            columns: "4",
            type: FieldType.Radio,
            name: "Glass Thickness",
            radioValue: "4 mm"
          },
          {
            title: "5 mm",
            columns: "4",
            type: FieldType.Radio,
            name: "Glass Thickness",
            radioValue: "5 mm"
          },
          {
            title: "6 mm",
            columns: "4",
            type: FieldType.Radio,
            name: "Glass Thickness",
            radioValue: "6 mm"
          },
          {
            title: "8 mm",
            columns: "4",
            type: FieldType.Radio,
            name: "Glass Thickness",
            radioValue: "8 mm"
          },
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Line,
                title: "Product Shape"
              },
              {
                type: FieldType.Group,
                columns: "6",
                fields: [
                  {
                    type: FieldType.Line,
                    title: "Circle"
                  },
                  {
                    title: "Diameter",
                    type: FieldType.Text,
                    outlined: true,
                    name: "Diameter",
                    defaultValue: 5,
                    leadingIcon: LensOutlined,
                  },
                  {
                    type: FieldType.Group,
                    fields: [
                      {
                        type: FieldType.Line,
                        title: "Processing (circle)"
                      },
                      {
                        title: "Polishing",
                        type: FieldType.Text,
                        outlined: true,
                        name: "Polishing"
                      },
                      {
                        title: "Cutting",
                        type: FieldType.Text,
                        outlined: true,
                        name: "Cutting"
                      }
                    ]
                  }
                ]
              },
              {
                type: FieldType.Group,
                columns: "6",
                fields: [
                  {
                    type: FieldType.Line,
                    title: "Rectangle"
                  },
                  {
                    title: "Length",
                    type: FieldType.Text,
                    outlined: true,
                    name: "Length",
                    defaultValue: 10,
                    inputType: 'number',
                    trailingIcon: SquareFoot,
                    isInvalid(obj) {
                      if (obj["Length"] < 10) {
                        return "Length cannot be less than 10";
                      } else {
                        return null
                      }
                    },
                    trailingIconClick(v, onChange) { alert(v) }
                  },
                  {
                    title: "Width",
                    type: FieldType.Text,
                    outlined: true,
                    name: "Width",
                    defaultValue: 20,
                    isInvalid(obj) {
                      if (obj["Width"] < 20) {
                        return "Width cannot be less than 20";
                      } else {
                        return null
                      }
                    },
                    inputType: 'number',
                    trailingIcon: SquareFoot,
                  },
                  {
                    title: "Area",
                    type: FieldType.Text,
                    outlined: true,
                    compute: (obj) => obj["Length"] * obj["Width"],
                    inputType: 'number',
                  },
                  {
                    type: FieldType.Line,
                    title: "Available 500 units volume"
                  },
                  {
                    type: FieldType.Progress,
                    compute: (obj) => obj["Length"] * obj["Width"],
                    maxPercent: 500,
                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Line,
        title: "Comment"
      },
      {
        title: "Comment",
        type: FieldType.Text,
        outlined: true,
        name: "Comment",
        inputRows: 5,
      },
    ]
  },
  {
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Line,
        title: "Delivery Method"
      },
      {
        title: "Pickup",
        type: FieldType.Switch,
        name: "Pickup",
        inputType: 'date',
      },
      {
        title: "Address",
        type: FieldType.Text,
        outlined: true,
        name: "Address",
        focus, blur,
        isDisabled: (obj) => obj["Pickup"]
      },
    ]
  },
  {
    type: FieldType.Line,
    title: "Slider",
  },
  {
    type: FieldType.Slider,
    name: "Slider",
    leadingIcon: VolumeDown,
    trailingIcon: VolumeUp,
    leadingIconClick(v, d, p, onChange) { onChange(v - 1) },
    trailingIconClick(v, d, p, onChange) { onChange(v + 1) }
  },
  {
    type: FieldType.Line,
    title: "Lists",
  },
  {
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Group,
        columns: "6",
        fields: [
          {
            type: FieldType.Combo,
            title: "Element Selection",
            description: "Select one element",
            name: "Element Selection",
            itemList: ["Element 1", "Element 2", "Element 3"]
          },
        ]
      },
      {
        type: FieldType.Group,
        columns: "6",
        fields: [
          {
            type: FieldType.Items,
            title: "Elements Selection",
            description: "Select multiple elements",
            name: "Elements Selection",
            itemList: ["Element 1", "Element 2", "Element 3"]
          },
        ]
      },
    ]
  },
];
```

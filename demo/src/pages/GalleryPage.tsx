import { Add, Remove } from '@mui/icons-material';

import { OneTyped, FieldType, TypedField } from 'react-declarative';

import Logger from '../components/Logger';

const fields: TypedField[] = [
    {
        type: FieldType.Center,
        style: {
            minHeight: 150,
        },
        columns: '6',
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: '1',
                fieldRightMargin: '1',
                phoneColumns: '12',
                columns: '3',
                child: {
                    type: FieldType.Typography,
                    placeholder: 'Content',
                }
            },
            {
                type: FieldType.Paper,
                fieldBottomMargin: '1',
                fieldRightMargin: '1',
                phoneColumns: '12',
                columns: '3',
                child: {
                    type: FieldType.Typography,
                    placeholder: 'Content',
                }
            },
            {
                type: FieldType.Paper,
                fieldBottomMargin: '1',
                fieldRightMargin: '1',
                phoneColumns: '12',
                columns: '3',
                child: {
                    type: FieldType.Typography,
                    placeholder: 'Content',
                }
            },
        ],
    },
    {
        type: FieldType.Group,
        columnsOverride: '5',
        fieldRightMargin: '0',
        fields: [...new Array(5)].map((_, idx) => ({
            type: FieldType.Paper,
            fieldRightMargin: idx === 4 ? '0' : '1',
            columns: '1',
            style: {
                minHeight: 125,
            }
        })),
    },
    {
        type: FieldType.Outline,
        fieldBottomMargin: '1',
        fields: [
            {
                type: FieldType.Line,
                title: 'Checkboxes',
            },
            {
                type: FieldType.Checkbox,
                name: 'checkbox1',
                columns: '3',
                title: 'Checkbox 1',
            },
            {
                type: FieldType.Checkbox,
                name: 'checkbox2',
                columns: '3',
                title: 'Checkbox 2',
            },
            {
                type: FieldType.Checkbox,
                name: 'checkbox3',
                columns: '3',
                title: 'Checkbox 3',
            },
            {
                type: FieldType.Checkbox,
                name: 'checkbox4',
                columns: '3',
                title: 'Checkbox 4',
            },
            {
                type: FieldType.Checkbox,
                name: 'checkbox5',
                columns: '3',
                title: 'Checkbox 5',
            },
            {
                type: FieldType.Checkbox,
                name: 'checkbox6',
                columns: '3',
                title: 'Checkbox 6',
            },
        ],
    },
    {
        type: FieldType.Paper,
        fieldBottomMargin: '1',
        fields: [
            {
                type: FieldType.Line,
                title: 'Radiobuttons'
            },
            {
                type: FieldType.Radio,
                name: 'radioButton1',
                radioValue: 'button1',
                title: 'Group 1 button 1',
                columns: '4',
            },
            {
                type: FieldType.Radio,
                name: 'radioButton1',
                radioValue: 'button2',
                title: 'Group 1 button 2',
                columns: '4',
            },
            {
                type: FieldType.Radio,
                name: 'radioButton1',
                radioValue: 'button3',
                title: 'Group 1 button 3',
                columns: '4',
            },
            {
                type: FieldType.Radio,
                name: 'radioButton2',
                radioValue: 'button1',
                title: 'Group 2 button 1',
                columns: '4',
            },
            {
                type: FieldType.Radio,
                name: 'radioButton2',
                radioValue: 'button2',
                title: 'Group 2 button 2',
                columns: '4',
            },
            {
                type: FieldType.Radio,
                name: 'radioButton2',
                radioValue: 'button3',
                title: 'Group 2 button 3',
                columns: '4',
            },
        ]
    },
    {
        type: FieldType.Paper,
        fieldBottomMargin: '1',
        fields: [
            {
                type: FieldType.Line,
                title: 'Progressbar and slider'
            },
            {
                type: FieldType.Progress,
                showPercentLabel: true,
                name: 'progress',
                maxPercent: 100,
                defaultValue: 30,
            },
            {
                type: FieldType.Slider,
                minSlider: 0,
                maxSlider: 100,
                name: 'progress',
                leadingIcon: Remove,
                leadingIconClick(value, onChange) {
                    onChange(value - 10);
                },
                trailingIcon: Add,
                trailingIconClick(value, onChange) {
                    onChange(value + 10);
                }
            }
        ]
    },
    {
        type: FieldType.Paper,
        fieldBottomMargin: '1',
        fields: [
            {
                type: FieldType.Line,
                title: 'Custom component and rating',
            },
            {
                type: FieldType.Component,
                element: (props) => <Logger {...(props || {})}/>, 
            },
            {
                type: FieldType.Rating,
                name: 'stars',
                defaultValue: 5,
            },
        ]
    },
    {
        type: FieldType.Paper,
        innerPadding: '0',
        child: {
            type: FieldType.Tabs,
            tabList: [
                "First",
                "Second",
                "Third"
            ],
            tabLine: true,
            tabBackground: true,
            fields: [
                {
                    type: FieldType.Group,
                    fields: [
                        {
                            type: FieldType.Typography,
                            typoVariant: 'body1',
                            placeholder: 'First Tab',
                        },
                        {
                            type: FieldType.Typography,
                            typoVariant: 'body1',
                            placeholder: 'First Tab',
                        },
                        {
                            type: FieldType.Typography,
                            typoVariant: 'body1',
                            placeholder: 'First Tab',
                        },
                    ],
                },
                {
                    type: FieldType.Typography,
                    typoVariant: 'body1',
                    placeholder: 'Second Tab',
                },
                {
                    type: FieldType.Typography,
                    typoVariant: 'body1',
                    placeholder: 'Third Tab',
                },
            ],
        },
    },
    {
        type: FieldType.Paper,
        roles: [
            "admin"
        ],
        child: {
            type: FieldType.Typography,
            typoVariant: 'body1',
            placeholder: 'Not allowed',
        },
    },
    {
        type: FieldType.Typography,
        roles: [
            "admin"
        ],
        typoVariant: 'h2',
        placeholder: 'Another hidden field',
    },
];

export const GalleryPage = () => (
    <OneTyped roles={["user"]} fields={fields}/>
);

export default GalleryPage;

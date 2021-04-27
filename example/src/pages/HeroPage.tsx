import React from 'react';

import { OneTyped, FieldType, TypedField } from 'react-view-builder';

const fields: TypedField[] = [
    {
        type: FieldType.Line,
        title: 'Hero layout test zone',
    },
    {
        type: FieldType.Div,
        style: {
            background: 'cyan',
        },
        fields: [
            {
                type: FieldType.Hero,
                height: '100px',
                fields: [
                    {
                        type: FieldType.Div,
                        style: {
                            background: 'magenta',
                        },
                        child: {
                            type: FieldType.Typography,
                            placeholder: 'Hello, world!',
                        }
                    }
                ],
            },
        ],
    },
];

export const HeroPage = () => (
    <OneTyped fields={fields} />
);

export default HeroPage;

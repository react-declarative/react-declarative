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

                phoneTop: '10px',
                phoneLeft: '10px',
                phoneRight: '10px',
                phoneBottom: '10px',

                tabletTop: '20px',
                tabletLeft: '20px',
                tabletRight: '20px',
                tabletBottom: '20px',

                desktopTop: '30px',
                desktopLeft: '30px',
                desktopRight: '30px',
                desktopBottom: '30px',

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

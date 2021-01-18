import React, { useState, Fragment } from 'react';

import { TypedField, FieldType, OneTyped } from 'react-view-builder';

import Logger from '../components/Logger';

const fields: TypedField[] = [
    {
        type: FieldType.Line,
        title: 'User info',
    },
    {
        type: FieldType.Group,
        phoneColumns: '12',
        tabletColumns: '6',
        desktopColumns: '3',
        fields: [
            {
                type: FieldType.Text,
                title: 'First name',
                description: 'Petr',
                name: 'firstName',
            },
            {
                type: FieldType.Text,
                title: 'Last name',
                description: 'Tripolsky',
                name: 'lastName',
            },
            {
                type: FieldType.Text,
                title: 'Email',
                description: 'tripolskypetr@gmail.com',
                name: 'email',
            }
        ],
    },
    {
        type: FieldType.Group,
        phoneColumns: '12',
        tabletColumns: '6',
        desktopColumns: '3',
        fields: [

        ],
    },
    {
        type: FieldType.Group,
        phoneColumns: '12',
        tabletColumns: '6',
        desktopColumns: '3',
        fields: [

        ],
    },
];

interface IData {
    firstName: string;
    lastName: string;
    email: string;
}

export const LayoutGrid = () => {
    const [data, setData] = useState<IData>();
    return (
        <Fragment>
            <OneTyped fields={fields} change={(newData) => setData(newData)} />
            <Logger {...(data || {})}/>
        </Fragment>
    );
}

export default LayoutGrid;


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
        desktopColumns: '4',
        fieldRightMargin: '0',
        fields: [
            {
                type: FieldType.Text,
                title: 'First name',
                defaultValue: 'Petr',
                description: 'Your first name',
                name: 'firstName',
            },
            {
                type: FieldType.Text,
                title: 'Last name',
                defaultValue: 'Tripolsky',
                description: 'Your last name',
                name: 'lastName',
            },
            {
                type: FieldType.Text,
                title: 'Email',
                defaultValue: 'tripolskypetr@gmail.com',
                description: 'Gmail. Yahoo, Yandex...',
                name: 'email',
            }
        ],
    },
    {
        type: FieldType.Group,
        phoneColumns: '12',
        tabletColumns: '6',
        desktopColumns: '4',
        fieldRightMargin: '0',
        fields: [
            {
                type: FieldType.Combo,
                name: 'gender',
                title: 'Gender',
                description: 'Your gender',
                itemList: [
                    'Male',
                    'Female',
                    'Other',
                ],
                defaultValue: 'Male',
            },
            {
                type: FieldType.Items,
                name: 'lists',
                title: 'User lists',
                description: 'Multiple input',
                itemList: [
                    'VIP',
                    'Blocklist',
                    'Allowlist',
                ],
                defaultValue: ['VIP', 'Allowlist'],
            },
            {
                type: FieldType.Text,
                inputType: 'number',
                title: 'Age',
                defaultValue: '21',
                description: '25',
                name: 'How old are you?',
            },
        ],
    },
    {
        type: FieldType.Group,
        phoneColumns: '12',
        tabletColumns: '6',
        desktopColumns: '4',
        fieldRightMargin: '0',
        fields: [
            {
                type: FieldType.Text,
                name: 'phone',
                title: 'Phone',
                description: 'Your phone',
                inputType: 'tel',
                defaultValue: '8999',
            },
            {
                type: FieldType.Text,
                name: 'fax',
                title: 'Fax',
                description: 'Your fax',
                inputType: 'tel',
                defaultValue: '8999',
            },
        ],
    },
    {
        type: FieldType.Text,
        name: 'comment',
        title: 'Any comment',
        inputRows: 4,
    },
    /*{
        type: FieldType.Component,
        compute: (props) => <small>{props.comment}</small>
    }*/
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


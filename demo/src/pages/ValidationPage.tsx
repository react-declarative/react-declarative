import React from 'react';

import { Fragment, useState } from 'react';

import { Email } from '@mui/icons-material';

import { OneTyped, FieldType, TypedField, IOption, Breadcrumbs2, usePreventLeave, IBreadcrumbs2Option, IBreadcrumbs2Action, Breadcrumbs2Type } from 'react-declarative';

import Logger from '../components/Logger';

import history from '../history';

const fields: TypedField<IOneData>[] = [
    {
        type: FieldType.Text,
        inputType: 'email',
        inputAutocomplete: 'on',
        name: 'email',
        title: 'Email',
        trailingIcon: Email,
        // defaultValue: 'tripolskypetr@gmail.com',
        isInvalid({email}) {
            const expr = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            if (!expr.test(email)) {
                return 'Invalid email address';
            } else {
                return null;
            }
        },
        isDisabled({disabled}) {
            return disabled;
        },
        isVisible({visible}) {
            return visible;
        }
    },
    {
        type: FieldType.Fragment,
        isVisible({visible}) {
            return visible;
        },
        fields: [
            {
                type: FieldType.Text,
                name: 'number',
                title: 'Number',
                description: 'Only number allowed',
                isInvalid({number}) {
                    if (isNaN(number as any) || number === '') {
                        return 'It is not a number';
                    }
                    return null;
                },
            },
        ],
    },
    {
        type: FieldType.Text,
        columns: '3',
        inputFormatterAllowed: /^[0-9.]/,
        inputFormatterTemplate: "000000000000000",
        name: 'from1',
        isInvalid: ({ from1, to1 }) => {
            if (!from1) {
                return null;
            }
            if (!to1) {
                return null;
            }
            if (parseInt(from1) > parseInt(to1)) {
                return "From > to";
            }
            return null;
        },
    },
    {
        type: FieldType.Text,
        columns: '3',
        inputFormatterAllowed: /^[0-9.]/,
        inputFormatterTemplate: "000000000000000",
        name: 'to1',
        isInvalid: ({ from1, to1 }) => {
            if (!from1) {
                return null;
            }
            if (!to1) {
                return null;
            }
            if (parseInt(from1) > parseInt(to1)) {
                return "From > to";
            }
            return null;
        },
    },

    {
        type: FieldType.Text,
        columns: '3',
        inputFormatterAllowed: /^[0-9.]/,
        inputFormatterTemplate: "000000000000000",
        name: 'from2',
        isInvalid: ({ from2, to2 }) => {
            if (!from2) {
                return null;
            }
            if (!to2) {
                return null;
            }
            if (parseInt(from2) > parseInt(to2)) {
                return "From > to";
            }
            return null;
        },
    },
    {
        type: FieldType.Text,
        columns: '3',
        inputFormatterAllowed: /^[0-9.]/,
        inputFormatterTemplate: "000000000000000",
        name: 'to2',
        isInvalid: ({ from2, to2 }) => {
            if (!from2) {
                return null;
            }
            if (!to2) {
                return null;
            }
            if (parseInt(from2) > parseInt(to2)) {
                return "From > to";
            }
            return null;
        },
    },

    {
        type: FieldType.Expansion,
        title: 'Settings',
        description: 'Hide or disable',
        fields: [
            {
                type: FieldType.Switch,
                title: 'Mark as visible',
                name: 'visible',
                defaultValue: true,
            },
            {
                type: FieldType.Switch,
                title: 'Mark as disabled',
                name: 'disabled',
            },
        ],
    },
];

const actions: IBreadcrumbs2Action[] = [
    {
        label: 'Sample action',
        action: 'sample-action',
    }
];

const items: IBreadcrumbs2Option<IOneData>[] = [
    {
        type: Breadcrumbs2Type.Link,
        label: 'title',
        action: 'title-action',
    },
    {
        type: Breadcrumbs2Type.Link,
        label: 'subtitle',
        action: 'subtitle-action',
    },
    {
        type: Breadcrumbs2Type.Button,
        isDisabled: (data) => data === null,
        label: 'Save',
        action: 'button-action',
    },
];

interface IOneData {
    disabled: boolean;
    visible: boolean;
    number: string;
    name: string;
    email: string;
    from1: string;
    to1: string;
    from2: string;
    to2: string;
}

export const ValidationPage = () => {

    const {
        data,
        oneProps,
        afterSave,
    } = usePreventLeave({
        history,
        onChange: console.log,
    });

    /*const [data, setData] = useState(null);
    const invalidity = () => setData(null);
    const change = (newData: any, initialChange: boolean) => {
        if (!initialChange) {
            setData(newData);
        }
    };*/

    const onAction = (action: string) => {
        if (action === "button-action") {
            afterSave();
        }
    };

    return (
        <Fragment>
            <Breadcrumbs2 payload={data} onAction={onAction} actions={actions} items={items} />
            <OneTyped<IOneData>
                fields={fields}
                {...oneProps}
                invalidity={console.log}
                handler={() => ({
                    from1: "150",
                    to1: "50",
                    from2: "150",
                    to2: "50",
                    disabled: false,
                    visible: true,
                    number: "42",
                    name: "petr",
                    email: "tripolskypetr@gmail.com"
                })}
            />
            <Logger {...(data || {})} />
        </Fragment>
    );
};

export default ValidationPage;

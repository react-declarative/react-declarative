import { Button } from '@material-ui/core';
import React, { useState } from 'react';

import { OneTyped, FieldType, TypedField } from 'react-view-builder';

const fields: TypedField[] = [
    {
        type: FieldType.Radio,
        name: 'button',
        radioValue: 'one',
        defaultValue: 'two',
        title: 'One',
    },
    {
        type: FieldType.Radio,
        name: 'button',
        radioValue: 'two',
        defaultValue: 'two',
        title: 'Two',
    }
];

const sleep = (timeout = 1000) => new Promise<void>((res) => setTimeout(() => res(), timeout));

export const LoginPage = () => {

    const [data, setData] = useState<any>();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = new FormData(e.target);
        console.log('Form data', form.get('email'), form.get('password'));
        console.log('One data', data.email, data.password);
        await sleep();
        return false;
    };

    const handleChange = (newData: any) => {
        console.log('change');
        setData(newData);
    };

    return (
        <form onSubmit={handleSubmit} autoComplete="on">
            <OneTyped handler={data} change={handleChange} fields={fields} />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </form>
    );  
};

export default LoginPage;

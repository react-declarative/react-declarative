import * as React from 'react';
import { isValidElement } from 'react';

import makeField from '../components/makeField';
import IField from '../model/IField';
import IManaged, { PickProp } from '../model/IManaged';

export interface IComponentFieldProps {
    compute?: PickProp<IField, 'compute'>;
}

interface IComponentFieldPrivate {
    value: PickProp<IManaged, 'value'>;
}

export const ComponentField = ({
    value,
}: IComponentFieldProps & IComponentFieldPrivate) => {
    if (isValidElement(value)) {
        return value;
    } else if (value) {
        return <p>Invalid component</p>;
    } else {
        return null;
    }
};

ComponentField.displayName = 'ComponentField';

export default makeField(ComponentField, false);

import * as React from 'react';
import { isValidElement } from 'react';

import makeField from '../components/makeField';

import IField from '../model/IField';
import IAnything from '../model/IAnything';
import IManaged, { PickProp } from '../model/IManaged';

export interface IComponentFieldProps<Data = IAnything> {
    compute?: PickProp<IField<Data>, 'compute'>;
}

interface IComponentFieldPrivate<Data = IAnything> {
    value: PickProp<IManaged<Data>, 'value'>;
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

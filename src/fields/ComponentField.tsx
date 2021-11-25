import * as React from 'react';
import { isValidElement } from 'react';

import makeField from '../components/makeField';

import IField from '../model/IField';
import IAnything from '../model/IAnything';
import IManaged, { PickProp } from '../model/IManaged';

const FIELD_NEVER_MARGIN = '0';

export interface IComponentFieldProps<Data = IAnything> {
    compute?: PickProp<IField<Data>, 'compute'>;
    elementRef?: PickProp<IField<Data>, 'elementRef'>;
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

export default makeField(ComponentField, {
    defaultProps: {
        fieldRightMargin: FIELD_NEVER_MARGIN,
        fieldBottomMargin: FIELD_NEVER_MARGIN,
    }
});

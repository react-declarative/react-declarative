import * as React from 'react';
import { Fragment } from 'react';
import { useState, useLayoutEffect } from 'react';

import makeField from '../components/makeField';
import { useOneState } from '../../../components/One/context/StateProvider';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import IManaged, { PickProp } from '../../../model/IManaged';

import deepClone from '../../../utils/deepClone';

const FIELD_NEVER_MARGIN = '0';

export interface IComponentFieldProps<Data = IAnything> {
    element?: PickProp<IField<Data>, 'element'>;
    groupRef?: PickProp<IField<Data>, 'groupRef'>;
    className?: PickProp<IField<Data>, 'className'>;
    style?: PickProp<IField<Data>, 'style'>;
}

interface IComponentFieldPrivate<Data = IAnything> {
    object: PickProp<IManaged<Data>, 'object'>;
}

export const ComponentField = ({
    element: Element = () => <Fragment />,
    object,
}: IComponentFieldProps & IComponentFieldPrivate) => {
    const [ node, setNode ] = useState<JSX.Element | null>(null);
    const { setObject } = useOneState();
    const handleChange = (object: unknown) => setObject(deepClone(object));
    useLayoutEffect(() => {
        const onChange = (data: Record<string, any>) => handleChange({ ...object, ...data });
        const props = { ...object, onChange };
        setNode(() => (
            <Element
                {...props}
            />
        ));
    }, [object]);
    return node;
};

ComponentField.displayName = 'ComponentField';

export default makeField(ComponentField, {
    defaultProps: {
        fieldRightMargin: FIELD_NEVER_MARGIN,
        fieldBottomMargin: FIELD_NEVER_MARGIN,
    }
});

import * as React from 'react';
import { Fragment } from 'react';
import { useState, useLayoutEffect } from 'react';

import makeField from '../components/makeField';

import { useOneState } from '../../../components/One/context/StateProvider';
import { usePayload } from '../../../components/One/context/PayloadProvider';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import IManaged, { PickProp } from '../../../model/IManaged';

import deepClone from '../../../utils/deepClone';
import objects from '../../../utils/objects';
import arrays from '../../../utils/arrays';

type FieldIgnoreParam = keyof Omit<IManaged, keyof IField>;

const FIELD_NEVER_MARGIN = '0';

const FIELD_INTERNAL_PARAMS: FieldIgnoreParam[] = [
    "dirty",
    "fallback",
    "fieldReadonly",
    "invalid",
    "loading",
    "object",
    "onChange",
    "prefix",
    "value",
];

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
    ...otherProps
}: IComponentFieldProps & IComponentFieldPrivate) => {
    const [ node, setNode ] = useState<JSX.Element | null>(null);
    const { setObject } = useOneState();
    const _payload = usePayload();
    const handleChange = (object: unknown) => setObject(deepClone(object), {});
    useLayoutEffect(() => {
        const _fieldParams = Object.entries(otherProps as IField)
            .filter(([key]) => !FIELD_INTERNAL_PARAMS.includes(key as FieldIgnoreParam))
            .reduce((acm, [key, value]) => ({ ...acm, [key]: value }), {}) as IField;
        _fieldParams.readonly = otherProps["fieldReadonly"] || false;
        const onChange = (data: Record<string, any>) => handleChange({ ...objects(object), ...data });
        const _fieldData = arrays(object);
        const props = { ..._fieldData, onChange, _fieldParams, _fieldData, _payload };
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

import * as React from 'react';
import { useEffect } from 'react';

import If from '../../If';

import { useOnePayload } from '../context/PayloadProvider';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { PickProp } from '../../../model/IManaged';

import makeLayout from '../components/makeLayout/makeLayout';

export interface IConditionLayoutProps<Data = IAnything, Payload = IAnything> {
    condition?: PickProp<IField<Data, Payload>, 'condition'>;
}

interface IConditionLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactNode;
    fallback: PickProp<IEntity<Data>, 'fallback'>;
    ready: PickProp<IEntity<Data>, 'ready'>;
    object: PickProp<IEntity<Data>, 'object'>;
}

/**
 * Компоновка, которую можно скрыть, используя condition.
 * В отличие от isVisible умеет приходовать промис
 * Потомки передаются насквозь...
 */
export const ConditionLayout = <Data extends IAnything = IAnything>({
    children,
    condition = () => true,
    fallback = (e: Error) => {
        throw e;
    },
    object,
    ready,
}: IConditionLayoutProps<Data> & IConditionLayoutPrivate<Data>) => {

    const payload = useOnePayload();

    useEffect(() => {
        ready();
    }, [object]);

    const handleCondition = async (data: Data) => {
        return await condition(data, payload);
    };

    return (
        <If
            condition={handleCondition}
            fallback={fallback}
            payload={object}
        >
            {children}
        </If>
    );
};

ConditionLayout.displayName = 'ConditionLayout';

export default makeLayout(ConditionLayout) as typeof ConditionLayout;

import * as React from 'react';
import { memo, useRef, useCallback, useEffect, useState, Fragment } from 'react';

/* eslint-disable react/jsx-no-useless-fragment */

import isStatefull from '../../config/isStatefull';
import createFieldInternal from '../../config/createField';

import { useOneState } from '../../context/StateProvider';

import ExpansionLayout from '../../layouts/ExpansionLayout';
import PaperLayout from '../../layouts/PaperLayout';
import OutlineLayout from '../../layouts/OutlineLayout';
import GroupLayout from '../../layouts/GroupLayout';
import FragmentLayout from '../../layouts/FragmentLayout';
import DivLayout from '../../layouts/DivLayout';
import BoxLayout from '../../layouts/BoxLayout';
import TabsLayout from '../../layouts/TabsLayout';
import CenterLayout from '../../layouts/CenterLayout';
import StretchLayout from '../../layouts/StretchLayout';
import HeroLayout from '../../layouts/HeroLayout';
import ConditionLayout from '../../layouts/ConditionLayout';

import FieldType from '../../../../model/FieldType';
import IOneProps from '../../../../model/IOneProps';
import IEntity from '../../../../model/IEntity';
import IField from '../../../../model/IField';
import IAnything from '../../../../model/IAnything';

/**
 * Мы отображаем корневой компонент только после инициализации
 * полей вложенных групп...
 */
const countStatefull = (fields?: IField<any>[]) => {
    let total = fields?.filter(isStatefull).length || 0;
    if (fields) {
        total -= fields.reduce((acm, { hidden }) => hidden ? acm + 1 : acm, 0);
        total -= fields.reduce((acm, { type }) => type === FieldType.Init ? acm + 1 : acm, 0);
    }
    /* группа, вложенная в группу */
    return Math.max(total, 1);
};

interface IOneInternalProps<Data extends IAnything = IAnything, Payload = IAnything, Field extends IField<Data> = IField<Data>> extends IOneProps<Data, Payload, Field> {
    rendered: boolean;
}

export const OneInternal = <Data extends IAnything = IAnything, Payload = IAnything, Field extends IField<Data> = IField<Data>>({
    rendered = false,
    fields,
    roles,
    dirty,
    ready = () => null,
    prefix = 'root',
    invalidity = () => null,
    fallback = () => null,
    readonly,
    focus,
    blur,
    createField = createFieldInternal,
}: IOneInternalProps<Data, Payload, Field>) => {
    const waitingReady = useRef(countStatefull(fields));
    const { object, setObject } = useOneState<Data>();
    const [hasAnimationFrame, setHasAnimationFrame] = useState(rendered);

    /**
     * Изменяем локальный объект, сообщаем вышестоящему
     * компоненту о изменениях
     */
    const handleChange = useCallback((v: Data, invalidMap: Record<string, boolean>) => {
        setObject(v, invalidMap);
    }, []);

    /**
     * Отображение только после отрисовки всех полей
     * формы
     */
    const handleReady = useCallback(() => {
        if (--waitingReady.current === 0) {
            ready();
        }
    }, [ready]);

    /**
     * Предотвращает performWorkUntilDeadline stuck
     */
    useEffect(() => {
        !rendered && requestAnimationFrame(() => {
            setHasAnimationFrame(true);
        });
    }, []);

    if (!hasAnimationFrame) {
        return null;
    } else if (object) {
        return (
            <Fragment>
                {fields
                    ?.filter((field) => !roles || !field.roles || field.roles.some((role) => roles.includes(role)))
                    ?.map((field, index) => {
                        const currentPath = `${prefix}.${field.type}[${index}]`;
                        const entity: IEntity<Data> = {
                            invalidity: field.invalidity || invalidity,
                            readonly: readonly || field.readonly,
                            prefix: currentPath,
                            change: handleChange,
                            ready: handleReady,
                            fallback,
                            ...field,
                            focus(name, payload) {
                                field.focus && field.focus(name, payload);
                                focus && focus(name, payload);
                            },
                            blur(name, payload) {
                                field.blur && field.blur(name, payload);
                                blur && blur(name, payload);
                            },
                            object,
                            dirty,
                        };
                        const fields: IField<Data>[] = field.child ? 
                            [ field.child ]
                            : field.fields || [];
                        const one: IOneInternalProps<Data> = {
                            rendered,
                            ready: handleReady,
                            prefix: currentPath,
                            readonly: readonly || field.readonly,
                            fields,
                            roles,
                            handler: object,
                            invalidity,
                            focus,
                            blur,
                            dirty,
                        };
                        if (field.type === FieldType.Group) {
                            return (
                                <GroupLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </GroupLayout>
                            );
                        } else if (field.type === FieldType.Expansion) {
                            return (
                                <ExpansionLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </ExpansionLayout>
                            );
                        } else if (field.type === FieldType.Paper) {
                            return (
                                <PaperLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </PaperLayout>
                            );
                        } else if (field.type === FieldType.Outline) {
                            return (
                                <OutlineLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </OutlineLayout>
                            );
                        } else if (field.type === FieldType.Div) {
                            return (
                                <DivLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </DivLayout>
                            );
                        } else if (field.type === FieldType.Box) {
                            return (
                                <BoxLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </BoxLayout>
                            );
                        } else if (field.type === FieldType.Tabs) {
                            return (
                                <TabsLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </TabsLayout>
                            );
                        } else if (field.type === FieldType.Center) {
                            return (
                                <CenterLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </CenterLayout>
                            );
                        } else if (field.type === FieldType.Stretch) {
                            return (
                                <StretchLayout<Data>
                                    {...entity}
                                    key={currentPath}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </StretchLayout>
                            );
                        } else if (field.type === FieldType.Fragment) {
                            return (
                                <FragmentLayout<Data>
                                    key={currentPath}
                                    {...entity}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </FragmentLayout>
                            );
                        } else if (field.type === FieldType.Hero) {
                            return (
                                <HeroLayout<Data>
                                    key={currentPath}
                                    {...entity}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </HeroLayout>
                            );
                        } else if (field.type === FieldType.Condition) {
                            return (
                                <ConditionLayout<Data>
                                    key={currentPath}
                                    {...entity}
                                >
                                    <OneInternalMemo<Data> {...one} />
                                </ConditionLayout>
                            );
                        } else {
                            return createField(entity, currentPath);
                        }
                    })
                }
            </Fragment>
        );
    } else {
        return null;
    }
};

OneInternal.displayName = 'OneInternal';

export const OneInternalMemo = memo(OneInternal) as typeof OneInternal;

export default OneInternalMemo;

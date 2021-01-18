import * as React from 'react';
import { useRef, Fragment } from 'react';

/* eslint-disable react/jsx-no-useless-fragment */

import isStatefull from '../../config/isStatefull';
import createField from '../../config/createField';

import useResolved from '../../hooks/useResolved';

import ExpansionLayout from '../../layouts/ExpansionLayout';
import PaperLayout from '../../layouts/PaperLayout';
import GroupLayout from '../../layouts/GroupLayout';
import FragmentLayout from '../../layouts/FragmentLayout';
import DivLayout from '../../layouts/DivLayout';

import FieldType from '../../model/FieldType';
import IOneProps from '../../model/IOneProps';
import IEntity from '../../model/IEntity';
import IField from '../../model/IField';

/**
 * Мы отображаем корневой компонент только после инициализации
 * полей вложенных групп...
 */
const countStatefull = (fields?: IField[]) => {
    const total = fields?.filter(isStatefull).length;
    if (total) {
        return total;
    } else {
        /* группа, вложенная в группу */
        return 1;
    }
};

export const OneInternal = ({
    fields,
    ready = () => null,
    prefix = 'root',
    fallback = () => null,
    handler = () => ({}),
    invalidity = () => null,
    change = () => null,
    focus,
    blur,
}: IOneProps) => {
    const waitingReady = useRef(countStatefull(fields));
    const [object, setObject] = useResolved({
        handler,
        fallback,
        fields,
        change,
    });
    const handleChange = (v: object) => {
        setObject(v);
        change(v, false);
    };
    const handleReady = () => {
        if (--waitingReady.current === 0) {
            ready();
        }
    };
    if (object) {
        return (
            <Fragment>
                {fields?.map((field, index) => {
                    const currentPath = `${prefix}.${field.type}[${index}]`;
                    const entity: IEntity = {
                        invalidity: field.invalidity || invalidity,
                        change: handleChange,
                        ready: handleReady,
                        focus,
                        blur,
                        ...field,
                        object,
                    };
                    const one: IOneProps = {
                        change: handleChange,
                        ready: handleReady,
                        prefix: currentPath,
                        fields: field.fields as IField[],
                        handler: object,
                        invalidity,
                        focus,
                        blur,
                    };
                    if (field.type === FieldType.Group) {
                        return (
                            <GroupLayout
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternal {...one} />
                            </GroupLayout>
                        );
                    } else if (field.type === FieldType.Expansion) {
                        return (
                            <ExpansionLayout
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternal {...one} />
                            </ExpansionLayout>
                        );
                    } else if (field.type === FieldType.Paper) {
                        return (
                            <PaperLayout
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternal {...one} />
                            </PaperLayout>
                        );
                    } else if (field.type === FieldType.Div) {
                        return (
                            <DivLayout
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternal {...one} />
                            </DivLayout>
                        );
                    } else if (field.type === FieldType.Fragment) {
                        return (
                            <FragmentLayout
                                key={currentPath}
                                {...entity}
                            >
                                <OneInternal {...one} />
                            </FragmentLayout>
                        );
                    } else {
                        return createField(entity, currentPath);
                    }
                })}
            </Fragment>
        );
    } else {
        return null;
    }
};

OneInternal.displayName = 'OneInternal';

export default OneInternal;

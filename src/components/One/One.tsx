import * as React from 'react';
import { memo, useRef, useCallback, Fragment } from 'react';

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
    const waitingChecked = useRef(countStatefull(fields));
    const waitingReady = useRef(countStatefull(fields));
    const [object, setObject] = useResolved({
        handler,
        fallback,
        fields,
        change,
    });
    /**
     * Изменяем локальный объект, запускаем счетчик
     * валидаций входных значений полей
     */
    const handleChange = useCallback((v: object) => {
        waitingChecked.current = countStatefull(fields);
        setObject(v);
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
     * Производим коммит, если валидации на форме
     * пройдены
     */
    const handleCheck = useCallback(() => {
        if (--waitingChecked.current === 0) {
            change(object, false);
        }
    }, [change, object]);
    if (object) {
        return (
            <Fragment>
                {fields?.map((field, index) => {
                    const currentPath = `${prefix}.${field.type}[${index}]`;
                    const entity: IEntity = {
                        invalidity: field.invalidity || invalidity,
                        change: handleChange,
                        check: handleCheck,
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
                                <OneInternalMemo {...one} />
                            </GroupLayout>
                        );
                    } else if (field.type === FieldType.Expansion) {
                        return (
                            <ExpansionLayout
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternalMemo {...one} />
                            </ExpansionLayout>
                        );
                    } else if (field.type === FieldType.Paper) {
                        return (
                            <PaperLayout
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternalMemo {...one} />
                            </PaperLayout>
                        );
                    } else if (field.type === FieldType.Div) {
                        return (
                            <DivLayout
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternalMemo {...one} />
                            </DivLayout>
                        );
                    } else if (field.type === FieldType.Fragment) {
                        return (
                            <FragmentLayout
                                key={currentPath}
                                {...entity}
                            >
                                <OneInternalMemo {...one} />
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

export const OneInternalMemo = memo(OneInternal);

export default OneInternalMemo;

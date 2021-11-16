import * as React from 'react';
import { memo, useRef, useCallback, Fragment } from 'react';

/* eslint-disable react/jsx-no-useless-fragment */

import isStatefull from '../../config/isStatefull';
import createField from '../../config/createField';

import { useOneState } from './StateProvider';

import ExpansionLayout from '../../layouts/ExpansionLayout';
import PaperLayout from '../../layouts/PaperLayout';
import GroupLayout from '../../layouts/GroupLayout';
import FragmentLayout from '../../layouts/FragmentLayout';
import DivLayout from '../../layouts/DivLayout';
import CenterLayout from '../../layouts/CenterLayout';
import HeroLayout from '../../layouts/HeroLayout';

import FieldType from '../../model/FieldType';
import IOneProps from '../../model/IOneProps';
import IEntity from '../../model/IEntity';
import IField from '../../model/IField';
import IAnything from '../../model/IAnything';

/**
 * Мы отображаем корневой компонент только после инициализации
 * полей вложенных групп...
 */
const countStatefull = (fields?: IField<any>[]) => {
    const total = fields?.filter(isStatefull).length;
    if (total) {
        return total;
    } else {
        /* группа, вложенная в группу */
        return 1;
    }
};

export const OneInternal = <Data extends IAnything = IAnything>({
    fields,
    ready = () => null,
    prefix = 'root',
    invalidity = () => null,
    change = () => null,
    focus,
    blur,
}: IOneProps<Data>) => {
    const waitingReady = useRef(countStatefull(fields));
    const {object, setObject} = useOneState<Data>();
    /**
     * Изменяем локальный объект, сообщаем вышестоящему
     * компоненту о изменениях
     */
    const handleChange = useCallback((v: Data) => {
        change(v, false);
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
    if (object) {
        return (
            <Fragment>
                {fields?.map((field, index) => {
                    const currentPath = `${prefix}.${field.type}[${index}]`;
                    const entity: IEntity<Data> = {
                        invalidity: field.invalidity || invalidity,
                        change: handleChange,
                        ready: handleReady,
                        focus,
                        blur,
                        ...field,
                        object,
                    };
                    const fields: IField<Data>[] = field.child ? 
                        [ field.child ]
                        : field.fields!;
                    const one: IOneProps<Data> = {
                        change: handleChange,
                        ready: handleReady,
                        prefix: currentPath,
                        fields,
                        handler: object,
                        invalidity,
                        focus,
                        blur,
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
                    } else if (field.type === FieldType.Div) {
                        return (
                            <DivLayout<Data>
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternalMemo<Data> {...one} />
                            </DivLayout>
                        );
                    }  else if (field.type === FieldType.Center) {
                        return (
                            <CenterLayout<Data>
                                {...entity}
                                key={currentPath}
                            >
                                <OneInternalMemo<Data> {...one} />
                            </CenterLayout>
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

export const OneInternalMemo = memo(OneInternal) as typeof OneInternal;

export default OneInternalMemo;

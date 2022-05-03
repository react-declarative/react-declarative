import * as React from 'react';
import { memo } from 'react';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';

/* eslint-disable no-console */

import deepClone from '../../../../utils/deepClone';
import arrays from '../../../../utils/arrays';
import set from '../../../../utils/set';
import get from '../../../../utils/get';
import deepCompare from '../../../../utils/deepCompare';
import waitForBlur from '../../../../utils/wairForBlur';

import { makeStyles } from '../../../../styles';

import useDebounce from '../../hooks/useDebounce';

import Group, { IGroupProps } from '../../../common/Group';

import IAnything from '../../../../model/IAnything';
import IManaged from '../../../../model/IManaged';
import IEntity from '../../../../model/IEntity';
import IField, { Value } from '../../../../model/IField';

import classNames from '../../../../utils/classNames';

const DEBOUNCE_SPEED = 800;

const stretch = {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
};

const useStyles = makeStyles({
    root: {
      ...stretch,
      '& > *': {
        ...stretch,
        flexGrow: 1,
      },
      '& > * > *': {
        flexGrow: 1,
      }
    },
    hidden: {
      display: 'none',
    },
});

interface IConfig<Data = IAnything> {
    skipDebounce?: boolean;
    defaultProps?: Partial<Omit<IField<Data>, keyof {
        fields: never;
        child: never;
    }>>;
}

/**
 * - Оборачивает IEntity в удобную абстракцию IManaged, где сразу
 *   представлены invalid, disabled, visible и можно задваивать вызов onChange
 * - Управляет фокусировкой, мануально ожидая потерю фокуса, эмулируя onBlur
 */
export function makeField(
    Component: React.FC<IManaged>,
    config: IConfig = {
        skipDebounce: false,
        defaultProps: { },
    },
) {
    const component = <Data extends IAnything = IAnything>({
        className = '',
        columns = '',
        phoneColumns = '',
        tabletColumns = '',
        desktopColumns = '',
        isDisabled = () => false,
        isVisible = () => true,
        isInvalid = () => null,
        change = (v) => console.log({ v }),
        fallback = () => null,
        ready = () => null,
        compute,
        object,
        name = '',
        focus,
        blur,
        invalidity,
        disabled: fieldDisabled = false,
        readonly: fieldReadonly = false,
        autoFocus,
        style,
        groupRef: ref = () => null,
        fieldRightMargin,
        fieldBottomMargin,
        ...otherProps
    }: IEntity<Data>) => {

        const [groupRef, setGroupRef] = useState<HTMLDivElement>(null as never);

        const classes = useStyles();

        const [disabled, setDisabled] = useState<boolean>(fieldDisabled);
        const [readonly, setReadonly] = useState<boolean>(true);

        const [invalid, setInvalid] = useState<string | null>(null);
        const [visible, setVisible] = useState<boolean>(true);
        const [loading, setLoading] = useState<boolean>(false);
        const [dirty, setDirty] = useState<boolean>(false);

        const inputUpdate = useRef(false);
        const objectUpdate = useRef(false);

        /**
         * Чтобы поле input было React-управляемым, нельзя
         * передавать в свойство value значение null
         */
        const [value, setValue] = useState<Value>(false);

        const [debouncedValue, { pending, flush }] = useDebounce(
            value,
            config.skipDebounce ? 0 : DEBOUNCE_SPEED
        );

        const isMounted = useRef(true);

        useLayoutEffect(() => () => {
          isMounted.current = false;
        }, []);

        /**
         * Эффект входящего изменения.
         */
        useEffect(() => {
            const wasInvalid = !!invalid;
            objectUpdate.current = true;
            if (compute) {
                const result = compute(arrays(object));
                if (result instanceof Promise) {
                    setLoading(true)
                    result
                        .then((value) => isMounted.current && setValue(value))
                        .catch((e) => isMounted.current && fallback(e))
                        .then(() => isMounted.current && setLoading(false));
                } else {
                    setValue(result);
                }
            } else if (!name) {
                // void(0);
            } else {
                const disabled = isDisabled(object);
                const visible = isVisible(object);
                const invalid = isInvalid(object);
                const newValue = get(object, name);
                let isOk: boolean = newValue !== value;
                isOk = isOk && !wasInvalid;
                if (isOk) {
                    inputUpdate.current = true;
                    setValue(newValue);
                    setInvalid(invalid);
                }
                setDisabled(disabled);
                setVisible(visible);
            }
            /**
             * Отображаем форму только после отклика всех
             * полей
             */
            ready();
        }, [object]);

        /**
         * Эффект исходящего изменения. Привязан на изменение
         * value, обернутое в хук useDebounce для оптимизации
         * производительности
         */
        useEffect(() => {
            const wasInvalid = !!invalid;
            if (inputUpdate.current) {
                inputUpdate.current = false;
            } else if (objectUpdate.current) {
                objectUpdate.current = false;
            } else if (compute) {
                return;
            } else {
                const target = debouncedValue;
                const copy = deepClone(object);
                const check = set(copy, name, target);
                const invalid = isInvalid(copy);
                setInvalid(invalid);
                setDirty(true);
                if (!name) {
                    return;
                } else if (!check) {
                    throw new Error(`One error invalid name specified "${name}"`);
                } else if (invalid !== null) {
                    invalidity(invalid);
                    return;
                } else if (!deepCompare(object, copy) || wasInvalid) {
                    change(copy);
                }
            }
        }, [debouncedValue, object]);

        /*
         * Флаг readonly позволяет управлять автокомплитом формы. На мобильных
         * устройствах мы выключаем его до фокусировки input
         */
        useEffect(() => {
            const handler = () => setReadonly(false);
            groupRef && groupRef.addEventListener('touchstart', handler);
            return () => groupRef && groupRef.removeEventListener('touchstart', handler);
        }, [groupRef]);

        /**
         * Блокирует применение изменений,
         * если поле вычисляемое или только
         * на чтение
         */
        const handleChange = (newValue: Value, {
            skipReadonly = false,
        }: {
            skipReadonly?: boolean;
        } = {}) => {
            if (!isMounted.current) {
                return;
            }
            if (fieldReadonly && !skipReadonly) {
                return;
            }
            if (compute) {
                return;
            }
            setValue(newValue);
        };

        /**
         * Ссылка на группу хранится в useState для
         * правильной работы эффекта
         */
        const handleGroupRef = (element: HTMLDivElement | null) => {
            if (element) {
                setGroupRef(element);
            }
            ref(element);
        };

        /**
         * Запускает механизм вещания фокусировки,
         * использует полифил для ожидания потери
         * фокуса
         */
        const handleFocus = () => {
            if (!isMounted.current) {
                return;
            }
            if (!fieldReadonly) {
                setReadonly(false);
            }
            groupRef && waitForBlur(groupRef).then(() => {
                if (pending()) {
                    flush();
                }
                if (blur) {
                    blur();
                }
                setReadonly(true);
            });
            if (focus) {
                focus();
            }
        };

        const groupProps: IGroupProps<Data> = {
            columns,
            phoneColumns,
            tabletColumns,
            desktopColumns,
            fieldRightMargin,
            fieldBottomMargin,
            ...config.defaultProps,
        };

        const managedProps: IManaged<Data> = {
            onChange: handleChange,
            fallback,
            disabled: fieldDisabled || disabled,
            readonly: fieldReadonly || readonly,
            fieldReadonly,
            autoFocus,
            invalid,
            value,
            name,
            dirty,
            loading,
            object,
            ...otherProps,
        };

        const hidden = {
            [classes.hidden]: !visible,
        };

        const componentProps = {
            ...config.defaultProps,
            ...managedProps,
        };

        return (
            <Group
                ref={handleGroupRef}
                isItem
                style={style}
                className={classNames(className, classes.root, hidden)}
                {...groupProps}
                onFocus={handleFocus}
            >
                <Component {...componentProps as IManaged} />
            </Group>
        );
    };

    component.displayName = `Managed${Component.displayName || 'UnknownField'}`;

    return memo(component) as typeof component;
}

export default makeField;

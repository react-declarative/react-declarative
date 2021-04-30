import * as React from 'react';
import { memo, useRef, useState, useEffect } from 'react';

/* eslint-disable no-console */

import deepClone from '../../utils/deepClone';
import set from '../../utils/set';
import get from '../../utils/get';
import deepCompare from '../../utils/deepCompare';
import waitForBlur from '../../utils/wairForBlur';

import { makeStyles } from '@material-ui/core';

import useDebounce from '../../hooks/useDebounce';

import Group, { IGroupProps } from '../Group';

import IAnything from '../../model/IAnything';
import IManaged from '../../model/IManaged';
import IEntity from '../../model/IEntity';
import IField from '../../model/IField';

import classNames from '../../utils/classNames';

import useAutocomplete from '../../hooks/useAutocomplete';

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
    skipValueSnapshot?: boolean;
    useAutocomplete?: boolean;
    defaultProps?: Partial<Omit<IField<Data>, keyof {
        fields: never;
        child: never;
    }>>;
}

type Value = object | string | number | boolean;

/**
 * - Оборачивает IEntity в удобную абстракцию IManaged, где сразу
 *   представлены invalid, disabled, visible и можно задваивать вызов onChange
 * - Управляет фокусировкой, мануально ожидая потерю фокуса, эмулируя onBlur
 */
export function makeField(
    Component: React.FC<IManaged>,
    config: IConfig = {
        skipDebounce: false,
        useAutocomplete: false,
        defaultProps: { },
        skipValueSnapshot: false,
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
        ready = () => null,
        compute,
        object,
        name = '',
        focus,
        blur,
        invalidity,
        readonly = false,
        style,
        fieldRightMargin,
        fieldBottomMargin,
        ...otherProps
    }: IEntity<Data>) => {

        const groupRef: React.MutableRefObject<HTMLDivElement> = useRef(null as never);

        const classes = useStyles();

        const [disabled, setDisabled] = useState<boolean>(false);
        const [invalid, setInvalid] = useState<string | null>(null);
        const [visible, setVisible] = useState<boolean>(true);
        const [dirty, setDirty] = useState<boolean>(false);

        const inputUpdate = useRef(false);

        /**
         * Чтобы поле input было React-управляемым, нельзя
         * передавать в свойство value значение null
         */
        const [valueSnapshot, setValueSnapshot] = useState<Value>(false);
        const [value, setValue] = useState<Value>(false);

        const [debouncedValue, { pending, flush }] = useDebounce(
            value,
            config.skipDebounce ? 0 : 800
        );

        /**
         * Эффект входящего изменения.
         */
        useEffect(() => {
            if (name === 'radioButton2') {
                debugger;
              }
            const wasInvalid = !!invalid;
            if (compute) {
                setValue(compute(object, (v) => setValue(v)));
            } else if (!name) {
                // void(0);
            } else {
                const disabled = isDisabled(object);
                const visible = isVisible(object);
                const invalid = isInvalid(object);
                const newValue = get(object, name);
                let isOk: boolean = newValue !== value;
                if (!config.skipValueSnapshot) {
                    isOk = isOk && newValue !== valueSnapshot;
                }
                isOk = isOk && !wasInvalid;
                if (isOk) {
                    inputUpdate.current = true;
                    setValueSnapshot(newValue);
                    setValue(newValue);
                }
                setDisabled(disabled);
                setVisible(visible);
                setInvalid(invalid);
            }
            /**
             * Отображаем форму только после отклика всех
             * полей
             */
            ready();
        }, [object]);

        if (config.useAutocomplete) {
            useAutocomplete(groupRef, (target) => setValue(target.value));
        }

        /**
         * Эффект исходящего изменения. Привязан на изменение
         * value, обернутое в хук useDebounce для оптимизации
         * производительности
         */
        useEffect(() => {
            if (name === 'radioButton2') {
                debugger;
              }
            const wasInvalid = !!invalid;
            if (inputUpdate.current) {
                inputUpdate.current = false;
            } else if (compute) {
                return;
            } else {
                const target = config.skipDebounce ? value : debouncedValue;
                const copy = deepClone(object);
                const check = set(copy, name, target);
                const invalid = isInvalid(copy);
                setInvalid(invalid);
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
        }, [config.skipDebounce ? value : debouncedValue]);

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
            if (readonly && !skipReadonly) {
                return;
            }
            if (compute) {
                return;
            }
            setValue(newValue);
            setDirty(true);
        };

        /**
         * Запускает механизм вещания фокусировки,
         * использует полифил для ожидания потери
         * фокуса
         */
        const onFocus = () => {
            waitForBlur(groupRef.current as HTMLDivElement).then(() => {
                if (pending()) {
                    flush();
                }
                if (blur) {
                    blur();
                }
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
            disabled,
            invalid,
            value,
            name,
            dirty,
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
                ref={groupRef}
                isItem
                style={style}
                className={classNames(className, classes.root, hidden)}
                {...groupProps}
                onFocus={onFocus}
            >
                <Component {...componentProps as IManaged} />
            </Group>
        );
    };

    component.displayName = `Managed${Component.displayName || 'UnknownField'}`;

    return memo(component) as typeof component;
}

export default makeField;

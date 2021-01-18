import * as React from 'react';
import { useRef, useState, useEffect } from 'react';

/* eslint-disable no-console */

import deepClone from '../../utils/deepClone';
import set from '../../utils/set';
import get from '../../utils/get';
import deepCompare from '../../utils/deepCompare';
import waitForBlur from '../../utils/wairForBlur';

import { makeStyles } from '@material-ui/core';

import useDebounce from '../../hooks/useDebounce';

import Group from '../Group';

import IAnything from '../../model/IAnything';
import IManaged from '../../model/IManaged';
import IEntity from '../../model/IEntity';

import classNames from '../../utils/classNames';

type valueType = string | number | boolean | IAnything;

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

/**
 * - Оборачивает IEntity в удобную абстракцию IManaged, где сразу
 *   представлены invalid, disabled, visible и можно задваивать вызов onChange
 * - Управляет фокусировкой, мануально ожидая потерю фокуса, эмулируя onBlur
 */
export function makeField(
    Component: React.FC<IManaged>,
    skipDebounce = false
) {
    const component = ({
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
    }: IEntity) => {

        const groupRef = useRef<HTMLDivElement>(null);

        const classes = useStyles();

        const [disabled, setDisabled] = useState<boolean>(false);
        const [invalid, setInvalid] = useState<string | null>(null);
        const [visible, setVisible] = useState<boolean>(true);

        const inputUpdate = useRef(false);

        /**
         * Чтобы поле input было React-управляемым, нельзя
         * передавать в свойство value значение null
         */
        const [value, setValue] = useState<valueType>(false);
        const [debouncedValue, { pending, flush }] = useDebounce(
            value,
            skipDebounce ? 0 : 800
        );

        /**
         * Эффект входящего изменения.
         */
        useEffect(() => {
            if (compute) {
                setValue(compute(object, (v) => setValue(v)));
            } else if (!name) {
                // void(0);
            } else {
                const newValue = get(object, name);
                if (newValue !== value) {
                    inputUpdate.current = true;
                    setValue(newValue);
                }
                setDisabled(isDisabled(object, (v) => setDisabled(v)));
                setVisible(isVisible(object, (v) => setVisible(v)));
                setInvalid(isInvalid(object, (v) => setInvalid(v)));
            }
            /**
             * Вызываем коллбек для подсчета компонентов, получивших
             * изменения. Важно при первой отрисовке, пока все не
             * получили целевой объект форма не отображается
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
            } else if (compute) {
                return;
            } else {
                const copy = deepClone(object);
                const check = set(copy, name, debouncedValue);
                const invalid = isInvalid(copy, (v) => setInvalid(v));
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
        }, [debouncedValue]);

        const groupProps = {
            columns,
            phoneColumns,
            tabletColumns,
            desktopColumns,
            fieldRightMargin,
            fieldBottomMargin,
        };

        /**
         * Блокирует применение изменений,
         * если поле вычисляемое или только
         * на чтение
         */
        const handleChange = (newValue: IAnything, skipReadonly = false) => {
            if (readonly && !skipReadonly) {
                return;
            }
            if (compute) {
                return;
            }
            setValue(newValue);
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

        const managedProps: IManaged & {name: string} = {
            onChange: handleChange,
            disabled,
            invalid,
            value,
            name,
            ...otherProps,
        };

        const hidden = {
            [classes.hidden]: !visible,
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
                <Component {...managedProps} />
            </Group>
        );
    };

    component.displayName = `Managed${Component.displayName || 'UnknownField'}`;

    return component;
}

export default makeField;

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
import waitForMove from '../../../../utils/waitForMove';
import waitForTouch from '../../../../utils/waitForTouch';

import { makeStyles } from '../../../../styles';

import { useOnePayload } from '../../context/PayloadProvider';
import { useOneState } from '../../context/StateProvider';

import useDebounce from '../../hooks/useDebounce';

import Group, { IGroupProps } from '../../../common/Group';

import IAnything from '../../../../model/IAnything';
import IManaged from '../../../../model/IManaged';
import IEntity from '../../../../model/IEntity';
import IField, { Value } from '../../../../model/IField';

import singlerun from '../../../../utils/hof/singlerun';
import classNames from '../../../../utils/classNames';
import sleep from '../../../../utils/sleep';

import nameToTitle from '../../helpers/nameToTitle';

import OneConfig, { GET_REF_SYMBOL } from '../OneConfig';

const DEBOUNCE_SPEED = 800;
const APPLY_ATTEMPTS = 15;
const APPLY_DELAY = 10;

const stretch = {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
};

const useStyles = makeStyles()({
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
      display: 'none !important',
    },
    fieldReadonly: {
        pointerEvents: 'none',
    },
});

interface IConfig<Data = IAnything> {
    withApplyQueue?: boolean;
    skipDebounce?: boolean;
    skipDirtyClickListener?: boolean;
    skipFocusReadonly?: boolean;
    defaultProps?: Partial<Omit<IField<Data>, keyof {
        fields: never;
        child: never;
    }>>;
}

interface IChangeConfig {
    skipReadonly?: boolean;
}

/**
 * - Оборачивает IEntity в удобную абстракцию IManaged, где сразу
 *   представлены invalid, disabled, visible и можно задваивать вызов onChange
 * - Управляет фокусировкой, мануально ожидая потерю фокуса, эмулируя onBlur
 */
export function makeField(
    Component: React.FC<IManaged>,
    fieldConfig: IConfig = {
        withApplyQueue: false,
        skipDirtyClickListener: false,
        skipFocusReadonly: false,
        skipDebounce: false,
        defaultProps: { },
    },
) {
    const oneConfig = OneConfig[GET_REF_SYMBOL]();
    const component = <Data extends IAnything = IAnything>({
        className = '',
        sx,
        columns = '',
        phoneColumns = '',
        tabletColumns = '',
        desktopColumns = '',
        isDisabled = () => false,
        isVisible = () => true,
        isInvalid = () => null,
        isReadonly = () => false,
        change = (v) => console.log({ v }),
        fallback = () => null,
        ready = () => null,
        compute,
        bind,
        object: upperObject,
        name = '',
        title = nameToTitle(name) || undefined,
        focus,
        blur,
        invalidity,
        prefix,
        dirty: upperDirty = false,
        disabled: fieldDisabled = false,
        readonly: upperReadonly = false,
        autoFocus,
        style,
        groupRef: ref = () => null,
        fieldRightMargin = fieldConfig.defaultProps?.fieldRightMargin,
        fieldBottomMargin = fieldConfig.defaultProps?.fieldBottomMargin,
        ...otherProps
    }: IEntity<Data>) => {
        const [groupRef, setGroupRef] = useState<HTMLDivElement>(null as never);

        const { object: stateObject } = useOneState<Data>();
        const payload = useOnePayload();

        const object = stateObject || upperObject;

        const { classes } = useStyles();
        
        const [focusReadonly, setFocusReadonly] = useState<boolean>(true);
        const [fieldReadonly, setFieldReadonly] = useState<boolean>(upperReadonly);

        const [disabled, setDisabled] = useState<boolean>(fieldDisabled);
        const [invalid, setInvalid] = useState<string | null>(null);
        const [visible, setVisible] = useState<boolean>(true);
        const [loading, setLoading] = useState<boolean>(false);
        const [dirty, setDirty] = useState<boolean>(upperDirty);

        const inputUpdate = useRef(false);
        const objectUpdate = useRef(false);
        const bindUpdate = useRef(false);

        const fieldName = useRef(`${prefix}(${name || 'unknown'})`);

        /**
         * Чтобы поле input было React-управляемым, нельзя
         * передавать в свойство value значение null
         */
        const [value, setValue] = useState<Value>(false);

        const [debouncedValue, { pending, flush }] = useDebounce(
            value,
            fieldConfig.skipDebounce ? 0 : DEBOUNCE_SPEED
        );

        const isMounted = useRef(true);

        oneConfig.WITH_DISMOUNT_LISTENER && useLayoutEffect(() => () => {
          isMounted.current = false;
        }, []);

        /**
         * Если пользователь убрал мышь с поля ввода, следует
         * применить изменения
         */
        oneConfig.WITH_WAIT_FOR_MOVE_LISTENER && useEffect(() => waitForMove(() => {
            if (pending()) {
                flush();
            }
        }), []);

        /**
         * Перед событием клика на сенсорных экранах
         * следует применить изменение
         */
        oneConfig.WITH_WAIT_FOR_TOUCH_LISTENER && useEffect(() => waitForTouch(() => {
            if (pending()) {
                flush();
            }
        }), []);

        /**
         * Эффект входящего изменения.
         */
        useEffect(() => {
            const wasInvalid = !!invalid;
            objectUpdate.current = true;
            if (compute) {
                const result = compute(arrays(object), payload);
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
                const disabled = isDisabled(object, payload);
                const visible = isVisible(object, payload);
                const readonly = isReadonly(object, payload);
                setFieldReadonly(readonly);
                setDisabled(disabled);
                setVisible(visible);
            } else {
                const disabled = isDisabled(object, payload);
                const visible = isVisible(object, payload);
                const invalid = isInvalid(object, payload) || null;
                const readonly = isReadonly(object, payload);
                const newValue = get(object, name);
                let isOk: boolean = newValue !== value;
                isOk = isOk && !wasInvalid;
                if (isOk) {
                    inputUpdate.current = true;
                    setValue(newValue);
                    setInvalid(invalid);
                    invalid !== null && invalidity(name, invalid, payload);
                    change(object, {
                        [fieldName.current]: !!invalid,
                    });
                }
                setFieldReadonly(readonly);
                setDisabled(disabled);
                setVisible(visible);
            }
            if (bind) {
                !bindUpdate.current && bind(object, payload, (data) => {
                    bindUpdate.current = true;
                    const copy = deepClone(data);
                    const invalid = isInvalid(copy, payload) || null;
                    setInvalid(invalid);
                    invalid !== null && invalidity(name, invalid, payload);
                    change(copy, {
                        [fieldName.current]: !!invalid,
                    });
                });
                bindUpdate.current = false;
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
                const invalid = isInvalid(copy, payload) || null;
                setInvalid(invalid);
                setDirty(true);
                if (!name) {
                    return;
                } else if (!check) {
                    throw new Error(`One error invalid name specified "${name}"`);
                } else if (invalid !== null) {
                    invalidity(name, invalid, payload);
                    change(object, {
                        [fieldName.current]: !!invalid,
                    });
                } else if (!deepCompare(object, copy) || wasInvalid) {
                    change(copy, {
                        [fieldName.current]: !!invalid,
                    });
                }
            }
        }, [debouncedValue, object]);

        /*
         * Флаг readonly позволяет управлять автокомплитом формы. На мобильных
         * устройствах мы выключаем его до фокусировки input
         */
        oneConfig.WITH_MOBILE_READONLY_FALLBACK && useEffect(() => {
            const handler = () => setFocusReadonly(false);
            groupRef && groupRef.addEventListener('touchstart', handler);
            return () => groupRef && groupRef.removeEventListener('touchstart', handler);
        }, [groupRef]);

        /**
         * Если всплытие события клика не сработает, флаг dirty уберется при
         * первом изменени значения
         */
        oneConfig.WITH_DIRTY_CLICK_LISTENER && useEffect(() => {
            if (!fieldConfig.skipDirtyClickListener) {
                const handler = () => setDirty(true);
                groupRef && groupRef.addEventListener('click', handler, { passive: true });
                return () => groupRef && groupRef.removeEventListener('click', handler);
            }
            return undefined;
        }, [groupRef]);

        /**
         * При редактировании больших форм изменение целевого объекта
         * может произойти между исполнением хука входящего и исходящего изменения
         */
        const waitForApply = async () => {
            for (let i = 0; i !== APPLY_ATTEMPTS; i++) {
                if (!inputUpdate.current && !objectUpdate.current) {
                    break;
                }
                sleep(APPLY_DELAY);
            }
        };

        /**
         * Блокирует применение изменений,
         * если поле вычисляемое или только
         * на чтение
         */
        const handleChange = singlerun(async (newValue: Value, config: IChangeConfig = {}) => {
            if (fieldConfig.withApplyQueue) {
                await waitForApply();
            }
            return handleChangeSync(newValue, config);
        });

        /**
         * Для сохранения позиции курсора текстовых полей
         * ОБЯЗАТЕЛЬНО нужно вызывать setState вне контекста
         * промиса, так как полифил при сборке бандла использует
         * функцию генератор
         */
        const handleChangeSync = (newValue: Value, {
            skipReadonly,
        }: IChangeConfig = {}) => {
            if (inputUpdate.current) {
                return;
            }
            if (objectUpdate.current) {
                return;
            }
            if (!isMounted.current) {
                return;
            }
            if (fieldReadonly && !skipReadonly) {
                return;
            }
            if (upperReadonly && !skipReadonly) {
                return;
            }
            if (compute && !skipReadonly) {
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
            if (!fieldReadonly && !upperReadonly) {
                setFocusReadonly(false);
            }
            groupRef && waitForBlur(groupRef).then(() => {
                if (pending()) {
                    flush();
                }
                if (blur) {
                    blur(name, payload);
                }
                setFocusReadonly(true);
            });
            if (focus) {
                focus(name, payload);
            }
        };

        const groupProps: IGroupProps<Data> = {
            ...fieldConfig.defaultProps,
            columns,
            phoneColumns,
            tabletColumns,
            desktopColumns,
            fieldRightMargin,
            fieldBottomMargin,
            sx: { ...sx, ...fieldConfig.defaultProps?.sx },
        };

        const computeReadonly = () => {
            let isReadonly = false;
            isReadonly = isReadonly || upperReadonly;
            if (!fieldConfig.skipFocusReadonly) {
                isReadonly = isReadonly || focusReadonly;
            }
            isReadonly = isReadonly || fieldReadonly;
            isReadonly = isReadonly || !!compute;
            return isReadonly;
        };

        const managedProps: IManaged<Data> = {
            onChange: fieldConfig.withApplyQueue ? handleChange : handleChangeSync,
            fallback,
            disabled: fieldDisabled || disabled,
            readonly: computeReadonly(),
            dirty: dirty || upperDirty,
            autoFocus,
            invalid,
            value,
            name,
            loading,
            object,
            prefix,
            ...otherProps,
        };

        const classMap = {
            [classes.hidden]: !visible,
            [classes.fieldReadonly]: fieldReadonly,
        };

        const componentProps = {
            ...fieldConfig.defaultProps,
            ...managedProps,
            ...title && { title },
        };

        return (
            <Group
                ref={handleGroupRef}
                isItem
                style={style}
                className={classNames(className, classes.root, classMap)}
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

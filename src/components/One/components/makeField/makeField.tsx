import * as React from 'react';
import { memo } from 'react';
import { useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';

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
import useActualValue from '../../../../hooks/useActualValue';

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
import useFieldState from './useFieldState';

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

const DEFAULT_IS_DISABLED = () => false;
const DEFAULT_IS_VISIBLE = () => true;
const DEFAULT_IS_INVALID = () => null;
const DEFAULT_IS_READONLY = () => false;
const DEFAULT_CHANGE = (v: IAnything) => console.log({ v });
const DEFAULT_FALLBACK = () => null;
const DEFAULT_READY = () => null;
const DEFAULT_MAP = (data: IAnything) => data;
const DEFAULT_REF = () => null;

/**
 * - Оборачивает IEntity в удобную абстракцию IManaged, где сразу
 *   представлены invalid, disabled, visible и можно задваивать вызов onChange
 * - Управляет фокусировкой, мануально ожидая потерю фокуса, эмулируя onBlur
 */
export function makeField(
    originalComponent: React.FC<IManaged>,
    fieldConfig: IConfig = {
        withApplyQueue: false,
        skipDirtyClickListener: false,
        skipFocusReadonly: false,
        skipDebounce: false,
        defaultProps: { },
    },
) {
    const Component = memo(originalComponent) as unknown as React.FC<IManaged>;
    const oneConfig = OneConfig[GET_REF_SYMBOL]();
    const component = <Data extends IAnything = IAnything>({
        className = '',
        sx,
        columns = '',
        phoneColumns = '',
        tabletColumns = '',
        desktopColumns = '',
        isDisabled = DEFAULT_IS_DISABLED,
        isVisible = DEFAULT_IS_VISIBLE,
        isInvalid = DEFAULT_IS_INVALID,
        isReadonly = DEFAULT_IS_READONLY,
        change = DEFAULT_CHANGE,
        fallback = DEFAULT_FALLBACK,
        ready = DEFAULT_READY,
        compute,
        map = DEFAULT_MAP,
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
        groupRef: ref = DEFAULT_REF,
        fieldRightMargin = fieldConfig.defaultProps?.fieldRightMargin,
        fieldBottomMargin = fieldConfig.defaultProps?.fieldBottomMargin,
        ...otherProps
    }: IEntity<Data>) => {
        const { object: stateObject } = useOneState<Data>();
        const payload = useOnePayload();

        const object = stateObject || upperObject;

        const { classes } = useStyles();
        
        const {
            state: {
                dirty,
                disabled,
                fieldReadonly,
                focusReadonly,
                groupRef,
                invalid,
                loading,
                value,
                visible,
            },
            action: {
                setDirty,
                setDisabled,
                setFieldReadonly,
                setFocusReadonly,
                setGroupRef,
                setInvalid,
                setLoading,
                setValue,
                setVisible,
            },
        } = useFieldState({
            dirty: upperDirty,
            disabled: fieldDisabled,
            fieldReadonly: upperReadonly,
        });

        const inputUpdate = useRef(false);
        const objectUpdate = useRef(false);

        const fieldName = useRef(`${prefix}(${name || 'unknown'})`);

        const fieldReadonly$ = useActualValue(fieldReadonly);
        const upperReadonly$ = useActualValue(upperReadonly);
        const focusReadonly$ = useActualValue(focusReadonly);

        const [debouncedValue, { pending, flush }] = useDebounce(
            value,
            fieldConfig.skipDebounce ? 0 : DEBOUNCE_SPEED
        );

        const debouncedValue$ = useActualValue(debouncedValue);
        const invalid$ = useActualValue(invalid);
        const object$ = useActualValue(object);
        const value$ = useActualValue(value);

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
         * Коллбек входящего изменения.
         */
        const handleIncomingObject = useCallback(() => {
            const { current: invalid } = invalid$;
            const { current: object } = object$;
            const { current: value } = value$;
            const wasInvalid = !!invalid;
            objectUpdate.current = true;
            inputUpdate.current = false;
            if (compute) {
                const result = compute(arrays(object), payload);
                if (result instanceof Promise) {
                    setLoading(true)
                    result
                        .then((value) => isMounted.current && setValue(value))
                        .catch((e) => isMounted.current && fallback(e))
                        .finally(() => isMounted.current && setLoading(false));
                } else {
                    setValue(result);
                }
                const disabled = isDisabled(object, payload);
                const visible = isVisible(object, payload);
                const readonly = isReadonly(object, payload);
                setFieldReadonly(readonly);
                setDisabled(disabled);
                setVisible(visible);
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
            /**
             * Отображаем форму только после отклика всех
             * полей
             */
            ready();
        }, [object]);

        /**
         * Коллбек исходящего изменения
         */
        const handleOutgoingObject = useCallback(() => {
            const { current: debouncedValue } = debouncedValue$;
            const { current: invalid } = invalid$;
            const { current: object } = object$;
            const wasInvalid = !!invalid;
            if (inputUpdate.current) {
                inputUpdate.current = false;
            } else if (objectUpdate.current) {
                objectUpdate.current = false;
            } else if (compute) {
                return;
            } else {
                const copy = deepClone(object);
                const check = set(copy, name, debouncedValue);
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
                    change(map(copy, payload), {
                        [fieldName.current]: !!invalid,
                    });
                }
            }
        }, []);

        const lastDebouncedValue = useRef<Value>(debouncedValue);

        /**
         * Очередь применения изменений из объекта формы. Если прилетело
         * изменение до сабмита текущего значения, применяем незамедлительно
         */
        useEffect(() => {
            /**
             * Если в очереди изменение, данный код осуществит слияние изменений.
             * На следующей итерации отработает handleOutgoingObject, который получит
             * последний целевой объект по ссылке
             */
            if (pending()) {
                flush();
                return;
            }
            if (lastDebouncedValue.current === debouncedValue) {
                handleIncomingObject();
            }
            handleOutgoingObject();
            lastDebouncedValue.current = debouncedValue;
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
        const waitForApply = useCallback(async () => {
            for (let i = 0; i !== APPLY_ATTEMPTS; i++) {
                if (!inputUpdate.current && !objectUpdate.current) {
                    break;
                }
                sleep(APPLY_DELAY);
            }
        }, []);

        /**
         * Блокирует применение изменений,
         * если поле вычисляемое или только
         * на чтение
         */
        const handleChange = useMemo(() => singlerun(async (newValue: Value, config: IChangeConfig = {}) => {
            if (fieldConfig.withApplyQueue) {
                await waitForApply();
            }
            return handleChangeSync(newValue, config);
        }), []);

        /**
         * Для сохранения позиции курсора текстовых полей
         * ОБЯЗАТЕЛЬНО нужно вызывать setState вне контекста
         * промиса, так как полифил при сборке бандла использует
         * функцию генератор
         */
        const handleChangeSync = useCallback((newValue: Value, {
            skipReadonly,
        }: IChangeConfig = {}) => {
            const { current: fieldReadonly } = fieldReadonly$;
            const { current: upperReadonly } = upperReadonly$;
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
        }, []);

        /**
         * Ссылка на группу хранится в useState для
         * правильной работы эффекта
         */
        const handleGroupRef = useCallback((element: HTMLDivElement | null) => {
            if (element) {
                setGroupRef(element);
            }
            ref(element);
        }, []);

        /**
         * Запускает механизм вещания фокусировки,
         * использует полифил для ожидания потери
         * фокуса
         */
        const handleFocus = useCallback(() => {
            const { current: fieldReadonly } = fieldReadonly$;
            const { current: upperReadonly } = upperReadonly$;
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
        }, []);

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

        const computeReadonly = useCallback(() => {
            const { current: fieldReadonly } = fieldReadonly$;
            const { current: upperReadonly } = upperReadonly$;
            const { current: focusReadonly } = focusReadonly$;
            let isReadonly = false;
            isReadonly = isReadonly || upperReadonly;
            if (!fieldConfig.skipFocusReadonly) {
                isReadonly = isReadonly || focusReadonly;
            }
            isReadonly = isReadonly || fieldReadonly;
            isReadonly = isReadonly || !!compute;
            return isReadonly;
        }, []);

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

    component.displayName = `Managed${originalComponent.displayName || 'UnknownField'}`;

    return memo(component) as typeof component;
}

export default makeField;

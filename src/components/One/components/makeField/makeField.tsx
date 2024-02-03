import * as React from 'react';
import { memo } from 'react';
import { useEffect, useLayoutEffect, useCallback, useMemo } from 'react';

/* eslint-disable no-console */

import deepClone from '../../../../utils/deepClone';
import set from '../../../../utils/set';
import get from '../../../../utils/get';
import deepCompare from '../../../../utils/deepCompare';

import waitForBlur from '../../../../utils/wairForBlur';
import waitForMove from '../../../../utils/waitForMove';
import waitForTouch from '../../../../utils/waitForTouch';

import { makeStyles } from '../../../../styles';

import { useDebounceConfig } from '../../context/DebounceProvider';
import { useOnePayload } from '../../context/PayloadProvider';
import { useOneState } from '../../context/StateProvider';
import { useOneMenu } from '../../context/MenuProvider';

import useDebounce from '../../hooks/useDebounce';

import useManagedCompute from './hooks/useManagedCompute';
import useFieldMemory from './hooks/useFieldMemory';
import useFieldState from './hooks/useFieldState';
import useFieldGuard from './hooks/useFieldGuard';

import Group, { IGroupProps } from '../../../common/Group';

import IAnything from '../../../../model/IAnything';
import IManaged from '../../../../model/IManaged';
import IEntity from '../../../../model/IEntity';
import IField, { Value } from '../../../../model/IField';

import cancelable, { CANCELED_SYMBOL } from '../../../../utils/hof/cancelable';
import classNames from '../../../../utils/classNames';
import queued from '../../../../utils/hof/queued';
import sleep from '../../../../utils/sleep';

import nameToTitle from '../../helpers/nameToTitle';

import OneConfig, { GET_REF_SYMBOL } from '../OneConfig';

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
      },
      pointerEvents: 'all',
    },
    hidden: {
      display: 'none !important',
    },
    fieldReadonly: {
        '& > *': {
            pointerEvents: 'none !important' as 'none',
        },
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

const DEFAULT_CHANGE = (v: IAnything) => console.log({ v });
const DEFAULT_FALLBACK = () => null;
const DEFAULT_READY = () => null;
const DEFAULT_MAP = (data: IAnything) => data;
const DEFAULT_CLICK = () => null;
const DEFAULT_REF = () => null;
const DEFAULT_MENU = () => null;

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
        isDisabled: isDisabledUpper,
        isVisible: isVisibleUpper,
        isInvalid: isInvalidUpper,
        isIncorrect: isIncorrectUpper,
        isReadonly: isReadonlyUpper,
        change = DEFAULT_CHANGE,
        fallback = DEFAULT_FALLBACK,
        ready = DEFAULT_READY,
        compute: upperCompute,
        shouldRecompute,
        click = DEFAULT_CLICK,
        map = DEFAULT_MAP,
        object: upperObject,
        name = '',
        title = nameToTitle(name) || undefined,
        menu = DEFAULT_MENU,
        focus,
        blur,
        invalidity,
        prefix,
        dirty: upperDirty = false,
        disabled: fieldDisabled = false,
        readonly: upperReadonly = false,
        autoFocus,
        style,
        menuItems,
        groupRef: ref = DEFAULT_REF,
        fieldRightMargin = fieldConfig.defaultProps?.fieldRightMargin,
        fieldBottomMargin = fieldConfig.defaultProps?.fieldBottomMargin,
        outlinePaper = false,
        ...otherProps
    }: IEntity<Data>) => {
        const { object: stateObject, changeObject } = useOneState<Data>();
        const payload = useOnePayload();
        const { createContextMenu } = useOneMenu();

        const {
            isDisabled,
            isVisible,
            isInvalid,
            isIncorrect,
            isReadonly,
        } = useFieldGuard({
            prefix,
            name,
            isDisabled: isDisabledUpper,
            isVisible: isVisibleUpper,
            isInvalid: isInvalidUpper,
            isIncorrect: isIncorrectUpper,
            isReadonly: isReadonlyUpper,
        });

        const object = stateObject || upperObject;

        const { classes } = useStyles();

        const compute = useManagedCompute({
            compute: upperCompute,
            object,
            payload,
            shouldRecompute,
        });

        const {
            state: {
                dirty,
                disabled,
                fieldReadonly,
                focusReadonly,
                groupRef,
                invalid,
                incorrect,
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
                setIncorrect,
                setLoading,
                setValue: setValueAction,
                setVisible,
            },
        } = useFieldState({
            dirty: upperDirty,
            disabled: fieldDisabled,
        }, {
            compute,
            config: oneConfig,
            name,
            object,
            payload,
            isVisible,
            isDisabled,
            isInvalid,
            isIncorrect,
            isReadonly,
        });

        const debounceSpeed = useDebounceConfig(oneConfig);

        const [debouncedValue, { pending, flush }] = useDebounce(
            value,
            fieldConfig.skipDebounce ? 0 : debounceSpeed
        );

        const { memory } = useFieldMemory({
            prefix,
            name,
            lastDebouncedValue: debouncedValue,
            debouncedValue$: debouncedValue,
            fieldReadonly$: fieldReadonly,
            focusReadonly$: focusReadonly,
            invalid$: invalid,
            object$: object,
            upperReadonly$: upperReadonly,
            groupRef$: groupRef,
            value$: value,
        })

        /**
         * После первого вызова setValue мы должны начать
         * проверять входящую валидацию
         */
        const setValue = useCallback((value: Value) => {
            setValueAction(value);
            memory.initComplete = true;
        }, []);

        /**
         * Флаг дизмонтирования компонента, удобен для работы с промисами,
         * можно выпилить
         */
        oneConfig.WITH_DISMOUNT_LISTENER && useLayoutEffect(() => () => {
            memory.isMounted = false;
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
            const { invalid$: invalid } = memory;
            const { object$: object } = memory;
            const { value$: value } = memory;
            const wasInvalid = !!invalid;
            memory.objectUpdate = true;
            memory.inputUpdate = false;
            if (compute) {
                const visible = isVisible(object, payload);
                const result = visible ? compute(object, payload) : false;
                if (result instanceof Promise) {
                    setLoading(true)
                    result
                        .then((value) => memory.isMounted && setValue(value))
                        .catch((e) => memory.isMounted && fallback(e))
                        .finally(() => memory.isMounted && setLoading(false));
                } else {
                    setValue(result);
                }
                const disabled = isDisabled(object, payload);
                const readonly = isReadonly(object, payload);
                const invalid = isInvalid(object, payload) || null;
                const incorrect = isIncorrect(object, payload) || null;
                setFieldReadonly(readonly);
                setInvalid(invalid);
                setIncorrect(incorrect);
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
                const incorrect = isIncorrect(object, payload) || null;
                const readonly = isReadonly(object, payload);
                const newValue = get(object, name);
                let isOk: boolean = newValue !== value;
                isOk = isOk && !wasInvalid;
                if (isOk) {
                    memory.inputUpdate = true;
                    setValue(newValue);
                    setInvalid(invalid);
                    invalid !== null && invalidity(name, invalid, payload);
                    change(object, {
                        [memory.fieldName]: !!invalid,
                    });
                }
                setFieldReadonly(readonly);
                setIncorrect(incorrect);
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
            const { debouncedValue$: debouncedValue } = memory;
            const { invalid$: invalid } = memory;
            const { object$: object } = memory;
            const wasInvalid = !!invalid;
            if (memory.inputUpdate) {
                memory.inputUpdate = false;
            } else if (memory.objectUpdate) {
                memory.objectUpdate = false;
            } else if (compute) {
                return;
            } else {
                const copy = deepClone(object);
                const check = set(copy, name, debouncedValue);
                const invalid = isInvalid(copy, payload) || null;
                const incorrect = isIncorrect(copy, payload) || null;
                setInvalid(invalid);
                setIncorrect(incorrect);
                setDirty(true);
                if (!name) {
                    return;
                } else if (!check) {
                    throw new Error(`One error invalid name specified "${name}"`);
                } else if (invalid !== null) {
                    invalidity(name, invalid, payload);
                    change(copy, {
                        [memory.fieldName]: !!invalid,
                    });
                } else if (!deepCompare(object, copy) || wasInvalid) {
                    change(fieldConfig.skipDebounce ? map(copy, payload) : copy, {
                        [memory.fieldName]: !!invalid,
                    });
                }
            }
        }, []);

        /**
         * Коллбек входящей валидации, триггер из другого поля
         */
        const handleWasInvalid = useCallback(() => {
            if (!memory.initComplete) {
                return;
            }
            if (memory.inputUpdate) {
                return;
            }
            const { invalid$: wasInvalid, value$, object$ } = memory;
            const copy = deepClone(object$);
            set(copy, name, value$);
            const invalid = isInvalid(copy, payload) || null;
            const incorrect = isIncorrect(copy, payload) || null;
            if (!invalid && wasInvalid) {
                setInvalid(invalid);
                change(fieldConfig.skipDebounce ? map(copy, payload) : copy, {
                    [memory.fieldName]: !!invalid,
                });
            }
            if (invalid && !wasInvalid) {
                setInvalid(invalid);
                change(object$, {
                    [memory.fieldName]: !!invalid,
                });
            }
            setIncorrect(incorrect);
        }, []);

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
            if (memory.lastDebouncedValue === debouncedValue) {
                handleIncomingObject();
                handleWasInvalid();
            }
            handleOutgoingObject();
            memory.lastDebouncedValue = debouncedValue;
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
                if (!memory.inputUpdate && !memory.objectUpdate) {
                    break;
                }
                sleep(APPLY_DELAY);
            }
        }, []);

        /**
         * Позволяет отменить ожидание, применив к форме актуальное
         * значение поля ввода
         */
        const waitForApplyOrCancel = useMemo(() => cancelable(async () => {
            await waitForApply();
            return true;
        }), []);

        /**
         * Блокирует применение изменений,
         * если поле вычисляемое или только
         * на чтение
         */
        const handleChange = useMemo(() => queued(async (newValue: Value, config: IChangeConfig = {}) => {
            if (fieldConfig.withApplyQueue) {
                await waitForApplyOrCancel().then((result) => {
                    if (result !== CANCELED_SYMBOL) {
                        handleChangeSync(newValue, config);
                    }
                });
                return;
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
            const { fieldReadonly$: fieldReadonly } = memory;
            const { upperReadonly$: upperReadonly } = memory;
            if (memory.inputUpdate) {
                return;
            }
            if (memory.objectUpdate) {
                return;
            }
            if (!memory.isMounted) {
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
            const { fieldReadonly$: fieldReadonly } = memory;
            const { upperReadonly$: upperReadonly } = memory;
            const { groupRef$: groupRef } = memory;
            if (!memory.isMounted) {
                return;
            }
            if (!fieldReadonly && !upperReadonly) {
                setFocusReadonly(false);
            }
            groupRef && waitForBlur(groupRef, oneConfig.FIELD_BLUR_DEBOUNCE).then(() => {
                if (pending()) {
                    flush();
                }
                if (blur) {
                    blur(name, memory.object$, payload, (value) => managedProps.onChange(value, {
                        skipReadonly: true,
                    }), changeObject);
                }
                setFocusReadonly(true);
            });
            if (focus) {
                focus(name, memory.object$, payload, (value) => managedProps.onChange(value, {
                    skipReadonly: true,
                }), changeObject);
            }
        }, []);

        /**
         * Коллбек для управления контекстным меню
         */
        const handleMenu = useMemo(() => menuItems ? createContextMenu({
            name,
            menu,
            menuItems: menuItems!,
            onValueChange: (value) => managedProps.onChange(value, {
                skipReadonly: true,
            }),
        }) : undefined, []);

        /**
         * Коллбек для перехвата клика по полю
         */
        const handleClick = useCallback((e: React.MouseEvent<any>) => {
            click(name, e, memory.object$, payload, (value) => managedProps.onChange(value, {
                skipReadonly: true,
            }), changeObject);
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
            const { fieldReadonly$: fieldReadonly } = memory;
            const { upperReadonly$: upperReadonly } = memory;
            const { focusReadonly$: focusReadonly } = memory;
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
            incorrect,
            value,
            name,
            loading,
            object,
            prefix,
            outlinePaper,
            withContextMenu: menuItems?.length ? true : undefined,
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

        if (!visible) {
            return null;
        }

        return (
            <Group
                ref={handleGroupRef}
                data-testid={name}
                data-path={memory.fieldName}
                isItem
                style={style}
                className={classNames(className, classes.root, classMap)}
                {...groupProps}
                onFocus={handleFocus}
                onContextMenu={handleMenu}
                onClick={handleClick}
            >
                <Component {...componentProps as IManaged} />
            </Group>
        );
    };

    component.displayName = `Managed${originalComponent.displayName || 'UnknownField'}`;

    return memo(component) as typeof component;
}

export default makeField;

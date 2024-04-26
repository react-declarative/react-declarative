import * as React from 'react';
import { useMemo, useCallback } from 'react';

import ApiProvider from './context/ApiProvider';
import OneGenesis from './components/OneGenesis';
import PropsProvider from './context/PropsProvider';

import NoSsr from "../NoSsr";
import ModalManagerProvider from '../ModalManager';

import IField, { Value } from '../../model/IField';
import IOneProps from '../../model/IOneProps';
import IAnything from "../../model/IAnything";
import TypedField from "../../model/TypedField";
import IOnePublicProps from "../../model/IOnePublicProps";

import useActualCallback from '../../hooks/useActualCallback';
import useManagedProps from './hooks/useManagedProps';

import createFieldInternal from './config/createField';
import createLayoutInternal from './config/createLayout';

const DEFAULT_ONFOCUS = () => null;
const DEFAULT_ONBLUR = () => null;
const DEFAULT_ONMENU = () => null;
const DEFAULT_ONCLICK = () => null;
const DEFAULT_ONREADY = () => null;
const DEFAULT_ONCHANGE = () => null;
const DEFAULT_ONINVALID = () => null;
const DEFAULT_ONLOADSTART = () => null;
const DEFAULT_ONLOADEND = () => null;
const DEFAULT_READTRANSFORM = (value: Value) => value;
const DEFAULT_WRITETRANSFORM = (value: Value) => value;

/**
 * Creates a json template engine called `One` with the given props.
 *
 * @param props - The props for the component.
 * @param props.createField - The function to create a field.
 * @param props.createLayout - The function to create a layout.
 * @param props.apiRef - The API reference object.
 * @param props.changeSubject - The subject for change events.
 * @param props.reloadSubject - The subject for reload events.
 * @param props.updateSubject - The subject for update events.
 * @param props.onFocus - The callback function for focus events.
 * @param props.onBlur - The callback function for blur events.
 * @param props.onMenu - The callback function for menu events.
 * @param props.onClick - The callback function for click events.
 * @param props.onReady - The callback function for ready events.
 * @param props.onChange - The callback function for change events.
 * @param props.onInvalid - The callback function for invalid events.
 * @param props.onLoadStart - The callback function for load start events.
 * @param props.onLoadEnd - The callback function for load end events.
 * @param props.features - Additional features for the component.
 * @param props.otherProps - Additional props for the component.
 * @returns - The rendered component.
 */
export const One = <Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data>>(args: IOnePublicProps<Data, Payload, Field>) => {

    const props = useManagedProps(args);

    const {
        createField = createFieldInternal,
        createLayout = createLayoutInternal,
        apiRef,
        changeSubject,
        reloadSubject,
        updateSubject,
    } = props

    const onFocus = useActualCallback(props.onFocus || DEFAULT_ONFOCUS);
    const onBlur = useActualCallback(props.onBlur || DEFAULT_ONBLUR);
    const onMenu = useActualCallback(props.onMenu || DEFAULT_ONMENU);
    const onClick = useActualCallback(props.onClick || DEFAULT_ONCLICK);
    const onReady = useActualCallback(props.onReady || DEFAULT_ONREADY);
    const onChange = useActualCallback(props.onChange || DEFAULT_ONCHANGE);
    const onInvalid = useActualCallback(props.onInvalid || DEFAULT_ONINVALID);
    const onLoadStart = useActualCallback(props.onLoadStart || DEFAULT_ONLOADSTART);
    const onLoadEnd = useActualCallback(props.onLoadEnd || DEFAULT_ONLOADEND);

    const {
        focus = onFocus,
        blur = onBlur,
        menu = onMenu,
        click = onClick,
        ready = onReady,
        change = onChange,
        invalidity = onInvalid,
        loadStart = onLoadStart,
        loadEnd = onLoadEnd,
        features: upperFeatures,
        ...otherProps
    } = props;

    const readTransform = useActualCallback(props.readTransform || DEFAULT_READTRANSFORM);
    const writeTransform = useActualCallback(props.writeTransform || DEFAULT_WRITETRANSFORM);

    /**
     * The `memoizedProps` object stores memoized transformations for reading and writing values.
     * This object is used to optimize performance by caching the results of calculations instead of recomputing them.
     *
     * @typedef memoizedProps
     * @property readTransform - A memoized callback function that transforms a value for reading purposes.
     *   It takes four parameters: value, name, data, and payload.
     *   The function checks if the `value` parameter is truthy, and if so, calls the `readTransform` function with the provided parameters.
     *   If the `value` parameter is falsy, the function returns it without calling `readTransform`.
     * @property writeTransform - A memoized callback function that transforms a value for writing purposes.
     *   It takes four parameters: value, name, data, and payload.
     *   The function checks if the `value` parameter is truthy, and if so, calls the `writeTransform` function with the provided parameters.
     *   If the `value` parameter is falsy, the function returns it without calling `writeTransform`.
     */
    const memoizedProps = {
        readTransform: useCallback((value: Value, name: string, data: Data, payload: Payload) => {
            if (typeof value === 'string' || Array.isArray(value)) {
                return readTransform(value, name, data, payload);
            }
            return value;
        }, []),
        writeTransform: useCallback((value: Value, name: string, data: Data, payload: Payload) => {
            if (typeof value === 'string' || Array.isArray(value)) {
                return writeTransform(value, name, data, payload);
            }
            return value;
        }, []),
    };

    /**
     * An object representing a set of wrapped properties.
     *
     * @typedef WrappedProps
     * @property focus - A function to handle the focus event.
     * @property blur - A function to handle the blur event.
     * @property menu - A function to handle the menu event.
     * @property click - A function to handle the click event.
     * @property ready - A function to handle the ready event.
     * @property change - A function to handle the change event.
     * @property invalidity - A function to handle the invalidity event.
     * @property loadStart - A function to handle the loadStart event.
     * @property loadEnd - A function to handle the loadEnd event.
     */
    const wrappedProps = {
        focus,
        blur,
        menu,
        click,
        ready,
        change,
        invalidity,
        loadStart,
        loadEnd,
    };

    /**
     * @name features
     * @type {Array<string>}
     * @description
     * The `features` variable is a memoized version of the `upperFeatures` variable.
     * It stores an array of strings, representing the features that have been processed or filtered.
     *
     * The `useMemo` function is used to memoize the value of `upperFeatures` and update it only when necessary.
     *
     * If `upperFeatures` is a function, it is called and the result is assigned to `result`.
     * If `upperFeatures` is not a function, its value is directly assigned to `result`.
     *
     * If `result` is not an array, it is assumed to be an object. The object is converted to an array of strings
     * by mapping each key-value pair and keeping only the keys where the value is truthy. Null values are
     * filtered out using the `filter` method.
     *
     * The resulting `result` is finally returned as the value for the memoized `features` variable.
     *
     */
    const features = useMemo(() => {
        let result = upperFeatures;
        if (typeof upperFeatures === 'function') {
            result = upperFeatures();
        }
        if (result && !Array.isArray(result)) {
            result = Object.entries(result)
                .map(([key, value]) => value ? key : null as never)
                .filter((value) => !!value);
        }
        return result;
    }, []);

    /**
     * The `genesisProps` variable is an object that consists of various properties used in a particular context.
     *
     * @type {unknown}
     * @typedef IOneProps
     * @property otherProps - An array of other properties.
     * @property wrappedProps - An array of wrapped properties.
     * @property memoizedProps - An array of memoized properties.
     * @property createField - A function used to create fields.
     * @property createLayout - A function used to create layouts.
     * @property features - An array of features.
     */
    const genesisProps = {
        ...otherProps,
        ...wrappedProps,
        ...memoizedProps,
        createField,
        createLayout,
        features,
    } as unknown as IOneProps<Data, IField<Data>>;

    return (
        <NoSsr>
            <ApiProvider
                apiRef={apiRef}
                changeSubject={changeSubject}
                reloadSubject={reloadSubject}
                updateSubject={updateSubject}
            >
                <PropsProvider<Data, IField<Data>>
                    {...genesisProps}
                >
                    <ModalManagerProvider>
                        <OneGenesis<Data, IField<Data>>
                            {...genesisProps}
                        />
                    </ModalManagerProvider>
                </PropsProvider>
            </ApiProvider>
        </NoSsr>
    );
};

One.displayName = 'One';

export const OneTyped = <Data extends IAnything = IAnything, Payload extends IAnything = IAnything, Field = TypedField<Data>>(props: IOnePublicProps<Data, Payload, Field>) =>
  <One<Data, Payload, Field> {...props} />;

OneTyped.displayName = 'OneTyped';

/**
 * После написания формы можно включить строгую
 * проверку типов полей
 * <One.typed handler={...
 *     ^^^^^^
 */
One.typed = OneTyped;

export default One;

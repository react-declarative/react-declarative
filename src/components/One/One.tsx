import * as React from 'react';
import { useMemo } from 'react';

import ApiProvider from './context/ApiProvider';
import OneGenesis from './components/OneGenesis';
import PropsProvider from './context/PropsProvider';

import NoSsr from "../NoSsr";

import IField from '../../model/IField';
import IOneProps from '../../model/IOneProps';
import IAnything from "../../model/IAnything";
import TypedField from "../../model/TypedField";
import IOnePublicProps from "../../model/IOnePublicProps";

import useActualCallback from '../../hooks/useActualCallback';

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

/**
 * Creates a component called `One` with the given props.
 *
 * @param {object} props - The props for the component.
 * @param {function} props.createField - The function to create a field.
 * @param {function} props.createLayout - The function to create a layout.
 * @param {object} props.apiRef - The API reference object.
 * @param {object} props.changeSubject - The subject for change events.
 * @param {object} props.reloadSubject - The subject for reload events.
 * @param {object} props.updateSubject - The subject for update events.
 * @param {function} props.onFocus - The callback function for focus events.
 * @param {function} props.onBlur - The callback function for blur events.
 * @param {function} props.onMenu - The callback function for menu events.
 * @param {function} props.onClick - The callback function for click events.
 * @param {function} props.onReady - The callback function for ready events.
 * @param {function} props.onChange - The callback function for change events.
 * @param {function} props.onInvalid - The callback function for invalid events.
 * @param {function} props.onLoadStart - The callback function for load start events.
 * @param {function} props.onLoadEnd - The callback function for load end events.
 * @param {object} props.features - Additional features for the component.
 * @param {...*} props.otherProps - Additional props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
export const One = <Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data>>(props: IOnePublicProps<Data, Payload, Field>) => {

    const {
        createField = createFieldInternal,
        createLayout = createLayoutInternal,
        apiRef,
        changeSubject,
        reloadSubject,
        updateSubject,
    } = props;

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

    const genesisProps = {
        ...otherProps,
        ...wrappedProps,
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
                    <OneGenesis<Data, IField<Data>>
                        {...genesisProps}
                    />
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

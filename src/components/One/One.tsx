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

import createFieldInternal from './config/createField';
import createLayoutInternal from './config/createLayout';

export const One = <Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data>>(props: IOnePublicProps<Data, Payload, Field>) => {

    const {
        createField = createFieldInternal,
        createLayout = createLayoutInternal,
        apiRef,
        changeSubject,
        reloadSubject,
        updateSubject,
    } = props;

    const {
        focus = props.onFocus,
        blur = props.onBlur,
        ready = props.onReady,
        change = props.onChange,
        invalidity = props.onInvalid,
        loadStart = props.onLoadStart,
        loadEnd = props.onLoadEnd,
        features: upperFeatures,
        ...otherProps
    } = props;

    const wrappedProps = {
        focus,
        blur,
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
        return upperFeatures as unknown as string[];
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

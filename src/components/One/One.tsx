import * as React from 'react';

import IAnything from "../../model/IAnything";
import TypedField from "../../model/TypedField";

import IOnePublicProps from "../../model/IOnePublicProps";

import OneGenesis from './components/OneGenesis';
import PropsProvider from './context/PropsProvider';

export const One = <Data extends IAnything = IAnything>(props: IOnePublicProps<Data>) => {

    const {
        focus = props.onFocus,
        blur = props.onBlur,
        ready = props.onReady,
        change = props.onChange,
        invalidity = props.onInvalid,
        loadStart = props.onLoadStart,
        loadEnd = props.onLoadEnd,
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

    const genesisProps = {
        ...otherProps,
        ...wrappedProps,
    };

    return (
        <PropsProvider
            {...genesisProps}
        >
            <OneGenesis
                {...genesisProps}
            />
        </PropsProvider>
    );
};

One.displayName = 'One';

export const OneTyped = <Data extends IAnything = IAnything>(props: IOnePublicProps<Data, TypedField<Data>>) =>
  <One<Data> {...props} />;

OneTyped.displayName = 'OneTyped';

/**
 * После написания формы можно включить строгую
 * проверку типов полей
 * <One.typed handler={...
 *     ^^^^^^
 */
One.typed = OneTyped;

export default One;

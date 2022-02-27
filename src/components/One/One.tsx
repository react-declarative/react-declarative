import * as React from 'react';

import IAnything from "../../model/IAnything";
import TypedField from "../../model/TypedField";

import IOnePublicProps from "../../model/IOnePublicProps";

import OneGenesis from './components/OneGenesis';

export const One = <Data extends IAnything = IAnything>(props: IOnePublicProps<Data>) => {

    const {
        focus = props.onFocus,
        blur = props.onBlur,
        ready = props.onReady,
        change = props.onChange,
        invalidity = props.onInvalid,
        ...otherProps
    } = props;

    const wrappedProps = {
        focus,
        blur,
        ready,
        change,
        invalidity,
    };

    return (
        <OneGenesis
            {...otherProps}
            {...wrappedProps}
        />
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

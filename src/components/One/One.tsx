import * as React from 'react';

import ApiProvider from './context/ApiProvider';
import OneGenesis from './components/OneGenesis';
import PropsProvider from './context/PropsProvider';

import IField from '../../model/IField';
import IOneProps from '../../model/IOneProps';
import IAnything from "../../model/IAnything";
import TypedField from "../../model/TypedField";
import IOnePublicProps from "../../model/IOnePublicProps";

import createFieldInternal from './config/createField';

export const One = <Data extends IAnything = IAnything, Field = IField<Data>>(props: IOnePublicProps<Data, Field>) => {

    const {
        createField = createFieldInternal,
        apiRef,
    } = props;

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
        createField,
    } as unknown as IOneProps<Data, IField<Data>>;

    return (
        <ApiProvider apiRef={apiRef}>
            <PropsProvider<Data, IField<Data>>
                {...genesisProps}
            >
                <OneGenesis<Data, IField<Data>>
                    {...genesisProps}
                />
            </PropsProvider>
        </ApiProvider>
    );
};

One.displayName = 'One';

export const OneTyped = <Data extends IAnything = IAnything, Field = TypedField<Data>>(props: IOnePublicProps<Data, Field>) =>
  <One<Data, Field> {...props} />;

OneTyped.displayName = 'OneTyped';

/**
 * После написания формы можно включить строгую
 * проверку типов полей
 * <One.typed handler={...
 *     ^^^^^^
 */
One.typed = OneTyped;

export default One;

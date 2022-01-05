import * as React from 'react';
import { useState, useLayoutEffect, useRef } from 'react';

/* eslint-disable react/no-multi-comp */

import { makeStyles } from '../../styles';

import OneInternal from './One';
import Group from '../common/Group';

import TypedField from '../../model/TypedField';
import IOneProps from '../../model/IOneProps';
import IAnything from '../../model/IAnything';
import IField from '../../model/IField';

import classNames from '../../utils/classNames';
import deepFlat from '../../utils/deepFlat';
import arrays from '../../utils/arrays';

import useStatic from '../../hooks/useStatic';

import StateProvider from './StateProvider';

const useStyles = makeStyles({
  hidden: {
    display: 'none',
  },
});

export const One = <Data extends IAnything = IAnything>(props: IOneProps<Data>) => {

  const [visible, setVisible] = useState(false);
  const isMounted = useRef(true);

  const {
    change = (data) => console.log({ data }),
    ready = () => null,
    fields = [],
  } = props;

  const {
    className,
    style,
  } = props;

  const fieldsSnapshot = useStatic(fields);
  const classes = useStyles();

  useLayoutEffect(() => () => {
    isMounted.current = false;
  }, []);

  const handleReady = () => {
    if (isMounted.current) {
      setVisible(true);
      ready();
    }
  };

  const handleChange = (newData: Data, initial: boolean) => {
    let isValid = true;
    deepFlat(fields).forEach(({
      isInvalid = () => null
    }: IField<Data>) => {
      isValid = isValid && isInvalid(newData) === null;
    });
    if (isValid) {
      change(arrays(newData), initial);
    }
  };

  const stateParams = {
    ...props,
    fields: fieldsSnapshot,
    change: handleChange,
  };

  const viewParams = {
    ...props,
    fields: fieldsSnapshot,
    change: handleChange,
    ready: handleReady,
  };

  return (
    <StateProvider {...stateParams}>
      <Group
        className={classNames(className, {
          [classes.hidden]: !visible,
        })}
        style={style}
      >
        <OneInternal {...viewParams} />
      </Group>
    </StateProvider>
  );
};

One.displayName = 'One';

export const OneTyped = <Data extends IAnything = IAnything>(props: IOneProps<Data, TypedField<Data>>) =>
  <One<Data> {...props} />;

/**
 * После написания формы можно включить строгую
 * проверку типов полей
 * <One.typed handler={...
 *     ^^^^^^
 */
One.typed = OneTyped;

One.typed['displayName'] = 'OneTyped';

export default One;

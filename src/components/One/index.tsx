import * as React from 'react';
import { Fragment } from 'react';
import { useState } from 'react';

/* eslint-disable react/no-multi-comp */

import { makeStyles } from '@material-ui/core';

import OneInternal from './One';
import Group from '../Group';

import TypedField from '../../model/TypedField';
import IOneProps from '../../model/IOneProps';
import IAnything from '../../model/IAnything';
import IField from '../../model/IField';

import classNames from '../../utils/classNames';
import deepFlat from '../../utils/deepFlat';

const useStyles = makeStyles({
    hidden: {
      display: 'none',
    },
});

export const One = ({
    LoadPlaceholder = null,
    ready = () => null,
    change = () => null,
    fields,
    ...props
  }: IOneProps) => {
  const [visible, setVisible] = useState(false);
  const classes = useStyles();
  const handleReady = () => {
    setVisible(true);
    ready();
  };
  const handleChange = (newData: IAnything, initial: boolean) => {
    let isValid = true;
    deepFlat(fields, 'fields').forEach(({
      isInvalid = () => null
    }: IField) => {
      isValid = isValid && isInvalid(newData) === null;
    });
    if (isValid) {
      change(newData, initial);
    }
  };
  const params = {
    ...props,
    fields,
    ready: handleReady,
    change: handleChange,
  };
  return (
    <Fragment>
      <Group className={classNames({[classes.hidden]: !visible})}>
        <OneInternal {...params} />
      </Group>
      {!visible && LoadPlaceholder}
    </Fragment>
  );
};

One.displayName = 'One';

export const OneTyped = (props: IOneProps<TypedField>) => <One {...props} />;

/**
 * После написания формы можно включить строгую
 * проверку типов полей
 * <One.typed handler={...
 *     ^^^^^^
 */
One.typed = OneTyped;

One.typed['displayName'] = 'OneTyped';

export default One;

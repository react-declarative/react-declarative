import * as React from 'react';
import { Fragment } from 'react';
import { useState, createElement as h } from 'react';

/* eslint-disable react/no-multi-comp */

import { makeStyles } from '@material-ui/core';

import OneInternal from './One';
import Group from '../Group';

import IOneProps from '../../model/IOneProps';
import TypedField from '../../model/TypedField';

import classNames from '../../utils/classNames';

const useStyles = makeStyles({
    hidden: {
      display: 'none',
    },
});

export const One = ({
    LoadPlaceholder = null,
    ready = () => null,
    ...props
  }: IOneProps) => {
    const [visible, setVisible] = useState(false);
    const classes = useStyles();
    const onReady = () => {
      setVisible(true);
      ready();
    };
    return (
      <Fragment>
        <Group className={classNames({[classes.hidden]: !visible})}>
          {h(OneInternal, {...props, ready: onReady})}
        </Group>
        {!visible && LoadPlaceholder}
      </Fragment>
    )
  };

One.displayName = 'One';

export const OneTyped = (props: IOneProps<TypedField>) => h(One, props);

/**
 * После написания формы можно включить строгую
 * проверку типов полей
 * <One.typed handler={...
 *     ^^^^^^
 */
One.typed = OneTyped;

One.typed['displayName'] = 'OneTyped';

export default One;

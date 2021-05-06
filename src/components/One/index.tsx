import * as React from 'react';
import { Fragment } from 'react';
import { useState } from 'react';

/* eslint-disable react/no-multi-comp */

import { makeStyles } from '@material-ui/core';

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
import useResolved from '../../hooks/useResolved';

import AutocompleteHelper from '../../helpers/AutocompleteHelper';
import deepClone from '../../utils/deepClone';
import set from '../../utils/set';

const useStyles = makeStyles({
  hidden: {
    display: 'none',
  },
});

export const One = <Data extends IAnything = IAnything>({
    LoadPlaceholder = null,
    ready = () => null,
    change = () => null,
    fallback = () => null,
    handler = () => ({} as Data),
    fields,
    ...props
  }: IOneProps<Data>) => {
  const [visible, setVisible] = useState(false);
  const [object, setObject] = useResolved<Data>({
    handler,
    fallback,
    fields,
    change,
  });
  const fieldsSnapshot = useStatic(fields);
  const classes = useStyles();
  const handleReady = () => {
    setVisible(true);
    ready();
  };
  const handleChange = (newData: Data, initial: boolean) => {
    let isValid = true;
    deepFlat(fields, 'fields').forEach(({
      isInvalid = () => null
    }: IField<Data>) => {
      isValid = isValid && isInvalid(newData) === null;
    });
    if (isValid) {
      change(arrays(newData), initial);
      setObject(newData);
    }
  };
  const handleAutocomplete = (name: string, value: any) => {
    const copy = deepClone(object);
    if (!set(copy, name, value)) {
      throw new Error(`One error invalid name specified "${name}"`);
    }
    setObject(copy);
  };
  const params = {
    ...props,
    fields: fieldsSnapshot,
    change: handleChange,
    ready: handleReady,
    handler: object!,
  };
  return (
    <AutocompleteHelper handleWrite={handleAutocomplete}>
      <Fragment>
        {object && (
          <Group className={classNames({[classes.hidden]: !visible})}>
            <OneInternal {...params} />
          </Group>
        )}
        {!visible && LoadPlaceholder}
      </Fragment>
    </AutocompleteHelper>
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

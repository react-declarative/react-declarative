import * as React from 'react';
import { useState, useLayoutEffect, useRef, useMemo } from 'react';

/* eslint-disable react/no-multi-comp */

import { makeStyles, ThemeProvider } from '../../../../styles';

import OneInternal from '../OneInternal';
import Group from '../../../common/Group';

import IOneProps from '../../../../model/IOneProps';
import IAnything from '../../../../model/IAnything';
import IField from '../../../../model/IField';

import classNames from '../../../../utils/classNames';
import deepFlat from '../../../../utils/deepFlat';
import arrays from '../../../../utils/arrays';

import StateProvider from '../../context/StateProvider';

const useStyles = makeStyles({
  hidden: {
    display: 'none',
  },
});

export const OneGenesis = <Data extends IAnything = IAnything, Field extends IField<Data> = IField<Data>>(props: IOneProps<Data, Field>) => {

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

  const fieldsSnapshot = useMemo(() => fields, []);
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
    }: any) => {
      isValid = isValid && (isInvalid(newData) || null) === null;
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
    ready: handleReady,
  };

  return (
    <ThemeProvider>
      <StateProvider<Data, Field> {...stateParams}>
        <Group
          className={classNames(className, {
            [classes.hidden]: !visible,
          })}
          style={style}
        >
          <OneInternal {...viewParams} />
        </Group>
      </StateProvider>
    </ThemeProvider>
  );
};

OneGenesis.displayName = 'OneGenesis';

export default OneGenesis;

import * as React from 'react';
import { useRef, useMemo } from 'react';

import { ThemeProvider } from '../../../../styles';

import OneInternal from '../OneInternal';
import Group from '../../../common/Group';

import NoSsr from '../../../NoSsr';

import IOneProps from '../../../../model/IOneProps';
import IAnything from '../../../../model/IAnything';
import IField from '../../../../model/IField';

import deepFlat from '../../../../utils/deepFlat';
import arrays from '../../../../utils/arrays';

import StateProvider from '../../context/StateProvider';

import SlotFactory from '../SlotFactory';

export const OneGenesis = <Data extends IAnything = IAnything, Field extends IField<Data> = IField<Data>>(props: IOneProps<Data, Field>) => {

  const isReady = useRef(false);

  const {
    change = (data) => console.log({ data }),
    ready = () => null,
    fields = [],
    slots = {},
  } = props;

  const {
    className,
    style,
    sx,
  } = props;

  const fieldsSnapshot = useMemo(() => fields, []);

  const handleReady = () => {
    if (!isReady.current) {
      isReady.current = true;
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
    <NoSsr>
      <ThemeProvider>
        <StateProvider<Data, Field> {...stateParams}>
          <SlotFactory {...slots}>
            <Group
              className={className}
              style={style}
              sx={sx}
            >
              <OneInternal {...viewParams} />
            </Group>
          </SlotFactory>
        </StateProvider>
      </ThemeProvider>
    </NoSsr>
  );
};

OneGenesis.displayName = 'OneGenesis';

export default OneGenesis;

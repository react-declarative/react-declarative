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
import PayloadProvider from '../../context/PayloadProvider';

import useSingleton from '../../../../hooks/useSingleton';

export const OneGenesis = <Data extends IAnything = IAnything, Payload = IAnything, Field extends IField<Data> = IField<Data>>(props: IOneProps<Data, Payload, Field>) => {

  const isReady = useRef(false);

  const {
    change = (data) => console.log({ data }),
    ready = () => null,
    fields = [],
    slots = {},
    payload: upperPayload = {} as Payload,
  } = props;

  const payload = useSingleton(upperPayload);

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
      isValid = isValid && (isInvalid(newData, payload) || null) === null;
    });
    if (isValid) {
      change(arrays(newData), initial);
    }
  };

  const stateParams = {
    ...props,
    fields: fieldsSnapshot,
    change: handleChange,
    payload,
  };

  const viewParams = {
    ...props,
    fields: fieldsSnapshot,
    ready: handleReady,
    payload,
  };

  return (
    <NoSsr>
      <ThemeProvider>
        <StateProvider<Data, Payload, Field> {...stateParams}>
          <SlotFactory {...slots}>
            <PayloadProvider payload={payload}>
              <Group
                className={className}
                style={style}
                sx={sx}
              >
                <OneInternal<Data, Payload, Field> {...viewParams} />
              </Group>
            </PayloadProvider>
          </SlotFactory>
        </StateProvider>
      </ThemeProvider>
    </NoSsr>
  );
};

OneGenesis.displayName = 'OneGenesis';

export default OneGenesis;

import * as React from "react";
import { useRef, useMemo, useState, useCallback } from "react";

import { makeStyles } from "../../../../styles";

import { ThemeProvider } from "../../../../styles";

import OneInternal from "../OneInternal";
import Group from "../../../common/Group";

import IOneProps from "../../../../model/IOneProps";
import IAnything from "../../../../model/IAnything";
import IField from "../../../../model/IField";
import FieldType from "../../../../model/FieldType";

import classNames from "../../../../utils/classNames";
import deepFlat from "../../../../utils/deepFlat";

import StateProvider from "../../context/StateProvider";
import FeatureProvider from "../../context/FeatureProvider";
import PayloadProvider from "../../context/PayloadProvider";
import CacheProvider from "../../context/CacheProvider";
import RadioProvider from "../../context/RadioProvider";
import DebounceProvider from "../../context/DebounceProvider";
import OneContextProvider from "../../context/OneContextProvider";

import SlotFactory from "../SlotFactory";

import useSingleton from "../../../../hooks/useSingleton";
import useActualValue from "../../../../hooks/useActualValue";

import isBaseline from "../../config/isBaseline";
import MenuProvider from "../../context/MenuProvider";

const useStyles = makeStyles()({
  readonly: {
    pointerEvents: "none",
  },
  rendering: {
    pointerEvents: "none",
  },
});

const DEFAULT_READY = () => null;
const DEFAULT_CHANGE = (data: IAnything) => console.log({ data });

export const OneGenesis = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field extends IField<Data> = IField<Data>
>(
  props: IOneProps<Data, Payload, Field>
) => {
  const isReady = useRef(false);

  const [rendered, setRendered] = useState(false);

  const { classes } = useStyles();

  const {
    change = DEFAULT_CHANGE,
    ready = DEFAULT_READY,
    fields = [],
    slots = {},
    payload: upperPayload = {} as Payload,
    fieldDebounce = 0,
    features,
    context,
  } = props;

  const payload = useSingleton(upperPayload);

  const { className, style, sx } = props;

  const fieldsSnapshot = useMemo(() => fields, []);

  const ready$ = useActualValue(ready);
  const change$ = useActualValue(change);

  const handleReady = useCallback(() => {
    const { current: ready } = ready$;
    if (!isReady.current) {
      isReady.current = true;
      setRendered(true);
      ready();
    }
  }, []);

  const handleChange = useCallback((newData: Data, initial: boolean) => {
    const { current: change } = change$;
    let isValid = true;
    deepFlat(fields).forEach(({ isInvalid = () => null }: any) => {
      isValid = isValid && (isInvalid(newData, payload) || null) === null;
    });
    if (isValid) {
      change(newData, initial);
    }
  }, []);

  const stateParams = {
    ...props,
    context: undefined,
    fields: fieldsSnapshot,
    change: handleChange,
    features,
    payload,
  };

  const viewParams = {
    ...props,
    context: undefined,
    fields: fieldsSnapshot,
    ready: handleReady,
    features,
    payload,
    rendered,
  };

  const isBaselineAlign = useMemo(() => fieldsSnapshot.some(isBaseline), []);

  return (
    <ThemeProvider>
      <CacheProvider>
        <DebounceProvider payload={fieldDebounce}>
          <OneContextProvider context={context}>
            <RadioProvider
              initialState={() =>
                deepFlat(fields)
                  .filter(({ type }) => type === FieldType.Radio)
                  .filter(({ name }) => name)
                  .reduce<Record<string, string | null>>(
                    (acm, { name, defaultValue }) => ({
                      ...acm,
                      [name!]: acm[name!] || String(defaultValue) || null,
                    }),
                    {}
                  )
              }
            >
              <FeatureProvider features={features}>
                <PayloadProvider payload={payload}>
                  <StateProvider<Data, Payload, Field> {...stateParams}>
                    <MenuProvider>
                      <SlotFactory {...slots}>
                        <Group
                          isBaselineAlign={isBaselineAlign}
                          className={classNames(className, {
                            [classes.readonly]: props.readonly,
                            [classes.rendering]: !rendered,
                          })}
                          style={style}
                          sx={sx}
                        >
                          <OneInternal<Data, Payload, Field> {...viewParams} />
                        </Group>
                      </SlotFactory>
                    </MenuProvider>
                  </StateProvider>
                </PayloadProvider>
              </FeatureProvider>
            </RadioProvider>
          </OneContextProvider>
        </DebounceProvider>
      </CacheProvider>
    </ThemeProvider>
  );
};

OneGenesis.displayName = "OneGenesis";

export default OneGenesis;

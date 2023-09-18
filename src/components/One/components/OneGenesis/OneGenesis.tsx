import * as React from "react";
import { useRef, useMemo, useState, useCallback } from "react";

import { makeStyles } from "../../../../styles";

import { ThemeProvider } from "../../../../styles";

import OneInternal from "../OneInternal";
import Group from "../../../common/Group";

import IOneProps from "../../../../model/IOneProps";
import IAnything from "../../../../model/IAnything";
import IField from "../../../../model/IField";

import classNames from "../../../../utils/classNames";
import deepFlat from "../../../../utils/deepFlat";
import arrays from "../../../../utils/arrays";

import StateProvider from "../../context/StateProvider";
import FeatureProvider from "../../context/FeatureProvider";
import PayloadProvider from "../../context/PayloadProvider";
import CacheProvider from "../../context/CacheProvider";

import SlotFactory from "../SlotFactory";

import useSingleton from "../../../../hooks/useSingleton";
import useActualValue from "../../../../hooks/useActualValue";

import isBaseline from "../../config/isBaseline";

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
    features,
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
      change(arrays(newData), initial);
    }
  }, []);

  const stateParams = {
    ...props,
    fields: fieldsSnapshot,
    change: handleChange,
    features,
    payload,
  };

  const viewParams = {
    ...props,
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
        <FeatureProvider features={features}>
          <PayloadProvider payload={payload}>
            <StateProvider<Data, Payload, Field> {...stateParams}>
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
            </StateProvider>
          </PayloadProvider>
        </FeatureProvider>
      </CacheProvider>
    </ThemeProvider>
  );
};

OneGenesis.displayName = "OneGenesis";

export default OneGenesis;

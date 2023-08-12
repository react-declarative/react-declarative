import * as React from "react";
import { useRef, useMemo, useState } from "react";

import { makeStyles } from "../../../../styles";

import { ThemeProvider } from "../../../../styles";

import OneInternal from "../OneInternal";
import Group from "../../../common/Group";

import NoSsr from "../../../NoSsr";

import IOneProps from "../../../../model/IOneProps";
import IAnything from "../../../../model/IAnything";
import IField from "../../../../model/IField";

import classNames from "../../../../utils/classNames";
import deepFlat from "../../../../utils/deepFlat";
import arrays from "../../../../utils/arrays";

import StateProvider from "../../context/StateProvider";

import SlotFactory from "../SlotFactory";
import PayloadProvider from "../../context/PayloadProvider";

import useSingleton from "../../../../hooks/useSingleton";

const useStyles = makeStyles()({
  readonly: {
    pointerEvents: "none",
    cursor: "not-allowed",
  },
  rendering: {
    visibility: 'hidden',
    pointerEvents: 'none',
  },
});

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
    change = (data) => console.log({ data }),
    ready = () => null,
    fields = [],
    slots = {},
    payload: upperPayload = {} as Payload,
  } = props;

  const payload = useSingleton(upperPayload);

  const { className, style, sx } = props;

  const fieldsSnapshot = useMemo(() => fields, []);

  const handleReady = () => {
    if (!isReady.current) {
      isReady.current = true;
      setRendered(true);
      ready();
    }
  };

  const handleChange = (newData: Data, initial: boolean) => {
    let isValid = true;
    deepFlat(fields).forEach(({ isInvalid = () => null }: any) => {
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
    rendered,
  };

  return (
    <NoSsr>
      <ThemeProvider>
        <PayloadProvider payload={payload}>
          <StateProvider<Data, Payload, Field> {...stateParams}>
            <SlotFactory {...slots}>
              <Group
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
      </ThemeProvider>
    </NoSsr>
  );
};

OneGenesis.displayName = "OneGenesis";

export default OneGenesis;

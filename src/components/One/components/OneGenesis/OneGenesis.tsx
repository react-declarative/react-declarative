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

import MenuProvider from "../../context/MenuProvider";
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

const BASE_CLASS = "react-declarative__oneGenesis";

/**
 * The variable `useStyles` is a function that returns a makeStyles hook. This hook is used to create classes for styling components using the Material-UI library.
 *
 * @returns {Function} A makeStyles hook function.
 */
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

/**
 * Represents the OneGenesis component.
 * @param props - The props for the component.
 * @param props.change - The change callback function.
 * @param props.ready - The ready callback function.
 * @param props.fields - The fields array.
 * @param props.slots - The slots object.
 * @param props.payload - The payload object.
 * @param props.fieldDebounce - The debounce time for field updates.
 * @param props.features - The features object.
 * @param props.context - The context object.
 * @param props.className - The class name for the component.
 * @param props.style - The style object for the component.
 * @param props.sx - The inline style object for the component.
 * @return - The rendered component.
 */
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

  /**
   * A callback function that handles the ready state.
   *
   * This callback function is used to set the component's rendered state as true and call the ready function, if the component is not already in the ready state. It is a memoized callback
   * function created using the useCallback hook.
   *
   * @function handleReady
   * @returns {void}
   */
  const handleReady = useCallback(() => {
    const { current: ready } = ready$;
    if (!isReady.current) {
      isReady.current = true;
      setRendered(true);
      ready();
    }
  }, []);

  /**
   * Handles the change event by validating the new data and calling the provided callback function if the data is valid.
   *
   * @param {Data} newData - The new data being passed to the event handler.
   * @param {boolean} initial - Indicates if the data is being changed initially or not.
   *
   * @returns {void}
   */
  const handleChange = useCallback((newData: Data, initial: boolean) => {
    const { current: change } = change$;
    let isValid = true;
    deepFlat(fields).forEach(({ isInvalid = () => null, hidden }: IField) => {
      const isHidden = typeof hidden === 'function' ? hidden(payload) : hidden;
      if (!isHidden) {
        isValid = isValid && (isInvalid(newData, payload) || null) === null;
      }
    });
    if (isValid) {
      change(newData, initial);
    }
  }, []);

  /**
   * Represents the state parameters.
   * @typedef {Object} StateParams
   * @property {Object} props - The additional properties.
   * @property {undefined} context - The context information.
   * @property {Object} fields - The fields snapshot.
   * @property {function} change - The change handler function.
   * @property {Object} features - The feature details.
   * @property {Object} payload - The payload information.
   */
  const stateParams = {
    ...props,
    context: undefined,
    fields: fieldsSnapshot,
    change: handleChange,
    features,
    payload,
  };

  /**
   * Represents the view parameters for rendering a view.
   *
   * @typedef {Object} ViewParams
   * @property {Object} props - The props to pass to the view component.
   * @property {undefined} context - The context of the view.
   * @property {Object} fields - The fields snapshot for the view.
   * @property {function} ready - The callback function to handle the ready state.
   * @property {Object} features - The features for the view.
   * @property {Object} payload - The payload for the view.
   * @property {boolean} rendered - Indicates whether the view has been rendered.
   */
  const viewParams = {
    ...props,
    context: undefined,
    fields: fieldsSnapshot,
    ready: handleReady,
    features,
    payload,
    rendered,
  };

  /**
   * Determines if the baseline alignment is true.
   *
   * @typedef {boolean} isBaselineAlign
   */
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
                          className={classNames(className, BASE_CLASS, {
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

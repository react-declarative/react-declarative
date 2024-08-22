import * as React from "react";
import { useRef, useEffect } from "react";

import { useModal } from "../components/ModalProvider";

import OnePicker from "../components/common/OnePicker";

import IField from "../model/IField";
import IAnything from "../model/IAnything";
import TypedField from "../model/TypedField";
import IOneProps, { OneHandler } from "../model/IOneProps";
import IOnePublicProps from "../model/IOnePublicProps";

import useActualCallback from "./useActualCallback";
import useActualRef from "./useActualRef";

import Subject from "../utils/rx/Subject";

type Fn<Data = IAnything> = (d: Data | null) => void;

/**
 * Represents the parameters for a specific functionality or operation.
 *
 * @template Data - The type of data associated with the functionality or operation.
 * @template Payload - The type of payload associated with the functionality or operation.
 * @template Field - The type of field associated with the functionality or operation.
 */
interface IParams<
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data, Payload>
> {
  fields: Field[];
  title?: string;
  large?: boolean;
  canCancel?: boolean;
  handler?: OneHandler<Data, Payload>;
  payload?: IOneProps<Data, Payload, Field>["payload"];
  isBaseline?: IOneProps<Data, Payload, Field>["isBaseline"];
  isBaselineForRoot?: IOneProps<Data, Payload, Field>["isBaselineForRoot"];
  readTransform?: IOnePublicProps<Data, Payload, Field>["readTransform"];
  writeTransform?: IOnePublicProps<Data, Payload, Field>["writeTransform"];
  incomingTransform?: IOnePublicProps<Data, Payload, Field>["incomingTransform"];
  outgoingTransform?: IOnePublicProps<Data, Payload, Field>["outgoingTransform"];
  features?: IOnePublicProps<Data, Payload, Field>["features"];
  waitForChangesDelay?: number;
}

/**
 * Represents the state of a component with the following properties:
 * @interface IState
 */
interface IState {
  currentHandler: OneHandler;
  currentPayload: Exclude<IOneProps["payload"], undefined>;
  currentTitle?: string;
  open: boolean;
}

/**
 * Function useOne
 *
 * @template Data - The type of data.
 * @template Payload - The type of the payload.
 * @template Field - The type of the field.
 *
 * @param params - The parameters object.
 * @param params.fields - The fields array.
 * @param params.large - Indicates if the picker is large.
 * @param params.title - The default title.
 * @param params.handler - The default handler function.
 * @param params.payload - The default payload.
 * @param params.waitForChangesDelay - The delay for waiting changes.
 * @param params.features - The additional features.
 *
 * @returns - The function to open the picker.
 */
export const useOne = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data, Payload>
>({
  fields,
  large,
  canCancel,
  title: defaultTitle,
  handler: defaultHandler,
  payload: defaultPayload,
  waitForChangesDelay,
  readTransform,
  writeTransform,
  incomingTransform,
  outgoingTransform,
  isBaseline,
  isBaselineForRoot,
  features,
}: IParams<Data, Payload, Field>) => {
  const changeRef = useRef<Fn>();

  const getInitialState = useActualCallback(
    (): IState => ({
      currentHandler: defaultHandler,
      currentPayload: defaultPayload,
      currentTitle: defaultTitle,
      open: false,
    })
  );

  const [state$, setState] = useActualRef<IState>(getInitialState);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({
        ...prevState,
        currentHandler: defaultHandler,
      }));
    }
  }, [defaultHandler]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({
        ...prevState,
        currentPayload: defaultPayload,
      }));
    }
  }, [defaultPayload]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, currentTitle: defaultTitle }));
    }
  }, [defaultTitle]);

  const handleChange: Fn = (date) => {
    const { current } = changeRef;
    if (current) {
      current(date);
    }
    setState(getInitialState);
    hideModal();
  };

  const { showModal, hideModal } = useModal(
    () => (
      <OnePicker
        open
        large={large}
        canCancel={canCancel}
        waitForChangesDelay={waitForChangesDelay}
        fields={fields as unknown as IField[]}
        title={state$.current.currentTitle}
        handler={state$.current.currentHandler}
        payload={state$.current.currentPayload}
        readTransform={readTransform}
        writeTransform={writeTransform}
        incomingTransform={incomingTransform}
        outgoingTransform={outgoingTransform}
        onChange={handleChange}
        isBaseline={isBaseline}
        isBaselineForRoot={isBaselineForRoot}
        features={features}
      />
    ),
    []
  );

  return ({
    handler,
    payload,
    title,
  }: Partial<IParams<Data, Payload, Field>> = {}) =>
    new (class {
      constructor() {
        setState((prevState) => ({
          currentHandler:
            handler !== undefined ? handler : prevState.currentHandler,
          currentPayload:
            payload !== undefined ? payload : prevState.currentPayload,
          currentTitle: title !== undefined ? title : prevState.currentTitle,
          open: true,
        }));
        showModal();
      }
      then = (onData: Fn) => {
        changeRef.current = onData;
      };
      toPromise = async () => {
        const subject = new Subject<Data | null>();
        this.then(subject.next);
        return await subject.toPromise();
      };
    })();
};

export const useOneTyped = <
  Data extends IAnything = IAnything,
  Payload = IAnything
>(
  params: IParams<Data, Payload, TypedField<Data, Payload>>
) => useOne(params);

export default useOne;

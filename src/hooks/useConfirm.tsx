import * as React from "react";
import { useEffect, useRef } from "react";

import { useModal } from "../components/ModalProvider";

import ConfirmPicker from "../components/common/ConfirmPicker";

import useActualCallback from "./useActualCallback";
import useActualRef from "./useActualRef";

import Subject from "../utils/rx/Subject";

type Fn = (result: boolean) => void;

/**
 * Represents the state of an object.
 * @interface
 */
interface IState {
  currentCanCancel: boolean;
  currentTitle: string;
  currentMsg: string;
  open: boolean;
}

/**
 * Represents the parameters for a certain operation.
 *
 * @interface IParams
 */
interface IParams {
  title?: string;
  msg?: string;
  canCancel?: boolean;
}

/**
 * A hook that provides a confirm dialog functionality.
 *
 * @param params - The parameter object.
 * @param params.title - The default title of the confirm dialog.
 * @param params.msg - The default message of the confirm dialog.
 * @param params.canCancel - The default cancelability flag of the confirm dialog.
 *
 * @returns - A function that can be invoked to show the confirm dialog.
 */
export const useConfirm = ({
  title: defaultTitle = "",
  msg: defaultMsg = "",
  canCancel: defaultCanCancel = true,
}: IParams = {}) => {
  const changeRef = useRef<Fn>();

  const getInitialState = useActualCallback(
    (): IState => ({
      currentCanCancel: defaultCanCancel,
      currentTitle: defaultTitle,
      currentMsg: defaultMsg,
      open: false,
    })
  );

  const [state$, setState] = useActualRef<IState>(getInitialState);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, currentTitle: defaultTitle }));
    }
  }, [defaultTitle]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, currentMsg: defaultMsg }));
    }
  }, [defaultMsg]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({
        ...prevState,
        currentCanCancel: defaultCanCancel,
      }));
    }
  }, [defaultCanCancel]);

  const handleChange: Fn = (time) => {
    const { current } = changeRef;
    if (current) {
      current(time);
    }
    setState(getInitialState);
    hideModal();
  };

  const { showModal, hideModal } = useModal(
    () => (
      <ConfirmPicker
        open
        canCancel={state$.current.currentCanCancel}
        title={state$.current.currentTitle}
        msg={state$.current.currentMsg}
        onChange={handleChange}
      />
    ),
    []
  );

  return ({ canCancel, title, msg }: Partial<IParams> = {}) =>
    new (class {
      constructor() {
        setState((prevState) => ({
          currentTitle: title !== undefined ? title : prevState.currentTitle,
          currentCanCancel:
            canCancel !== undefined ? canCancel : prevState.currentCanCancel,
          currentMsg: msg !== undefined ? msg : prevState.currentMsg,
          open: true,
        }));
        showModal();
      }
      then = (onData: Fn) => {
        changeRef.current = onData;
      };
      toPromise = async () => {
        const subject = new Subject<boolean>();
        this.then(subject.next);
        return await subject.toPromise();
      };
    })();
};

export default useConfirm;

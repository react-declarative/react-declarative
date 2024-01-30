import * as React from "react";
import { useEffect, useRef } from "react";

import { useModal } from "../components/ModalProvider";

import AlertPicker from "../components/common/AlertPicker";

import useActualCallback from "./useActualCallback";
import useActualRef from "./useActualRef";

import Subject from "../utils/rx/Subject";

type Fn = () => void;

interface IParams {
  title?: string;
  description?: string;
  large?: boolean;
}

interface IState {
  currentDescription: string;
  currentTitle: string;
  open: boolean;
}

export const useAlert = ({
  title: defaultTitle = "Alert",
  description: defaultDescription = "",
  large = false,
}: IParams = {}) => {
  const changeRef = useRef<Fn>();

  const getInitialState = useActualCallback(
    (): IState => ({
      currentDescription: defaultDescription,
      currentTitle: defaultTitle,
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
      setState((prevState) => ({ ...prevState, currentDescription: defaultDescription }));
    }
  }, [defaultDescription]);

  const handleChange: Fn = () => {
    const { current } = changeRef;
    if (current) {
      current();
    }
    setState(getInitialState);
    hideModal();
  };

  const { showModal, hideModal } = useModal(
    () => (
      <AlertPicker
        open
        large={large}
        title={state$.current.currentTitle}
        description={state$.current.currentDescription}
        onOk={handleChange}
      />
    ),
    []
  );

  return ({ description, title }: Partial<IParams> = {}) =>
    new (class {
      constructor() {
        setState((prevState) => ({
          currentTitle: title !== undefined ? title : prevState.currentTitle,
          currentDescription: description !== undefined ? description : prevState.currentDescription,
          open: true,
        }));
        showModal();
      }
      then = (onData: Fn) => {
        changeRef.current = onData;
      };
      toPromise = async () => {
        const subject = new Subject<void>();
        this.then(subject.next);
        return await subject.toPromise();
      };
    })();
};

export default useAlert;

import * as React from "react";
import { useEffect, useRef } from "react";

import { useModal } from "../components/ModalProvider";

import PromptPicker from "../components/common/PromptPicker";

import useActualCallback from "./useActualCallback";
import useActualRef from "./useActualRef";

import Subject from "../utils/rx/Subject";

type Fn = (result: string | null) => void;

interface IParams {
  title?: string;
  value?: string;
  large?: boolean;
  placeholder?: string;
  canCancel?: boolean;
}

interface IState {
  currentCanCancel: boolean;
  currentPlaceholder: string;
  currentTitle: string;
  currentValue: string;
  open: boolean;
}

export const usePrompt = ({
  title: defaultTitle = "Prompt",
  value: defaultValue = "",
  placeholder: defaultPlaceholder = "Prompt",
  canCancel: defaultCanCancel = true,
  large = false,
}: IParams = {}) => {
  const changeRef = useRef<Fn>();

  const getInitialState = useActualCallback(
    (): IState => ({
      currentCanCancel: defaultCanCancel,
      currentPlaceholder: defaultPlaceholder,
      currentTitle: defaultTitle,
      currentValue: defaultValue,
      open: false,
    })
  );

  const [state$, setState] = useActualRef<IState>(getInitialState);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({
        ...prevState,
        currentCanCancel: defaultCanCancel,
      }));
    }
  }, [defaultCanCancel]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({
        ...prevState,
        currentPlaceholder: defaultPlaceholder,
      }));
    }
  }, [defaultPlaceholder]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, currentTitle: defaultTitle }));
    }
  }, [defaultTitle]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, currentValue: defaultValue }));
    }
  }, [defaultValue]);

  const handleChange: Fn = (value) => {
    const { current } = changeRef;
    if (current) {
      current(value);
    }
    setState(getInitialState);
    hideModal();
  };

  const { showModal, hideModal } = useModal(
    () => (
      <PromptPicker
        open
        large={large}
        canCancel={state$.current.currentCanCancel}
        title={state$.current.currentTitle}
        value={state$.current.currentValue}
        placeholder={state$.current.currentPlaceholder}
        onChange={handleChange}
      />
    ),
    []
  );

  return ({ canCancel, title, placeholder, value }: Partial<IParams> = {}) =>
    new (class {
      constructor() {
        setState((prevState) => ({
          currentPlaceholder:
            placeholder !== undefined
              ? placeholder
              : prevState.currentPlaceholder,
          currentCanCancel:
            canCancel !== undefined ? canCancel : prevState.currentCanCancel,
          currentTitle: title !== undefined ? title : prevState.currentTitle,
          currentValue: value !== undefined ? value : prevState.currentValue,
          open: true,
        }));
        showModal();
      }
      then = (onData: Fn) => {
        changeRef.current = onData;
      };
      toPromise = async () => {
        const subject = new Subject<string | null>();
        this.then(subject.next);
        return await subject.toPromise();
      };
    })();
};

export default usePrompt;

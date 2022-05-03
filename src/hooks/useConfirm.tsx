import * as React from 'react';
import { useState, useRef } from 'react';

import { useModal } from '../components/ModalProvider';

import ConfirmPicker from '../components/common/ConfirmPicker';

type Fn = (result: boolean) => void;

interface IParams {
  title?: string;
  msg?: string;
  canCancel?: boolean;
}

export const useConfirm = ({
  title: defaultTitle = "",
  msg: defaultMsg = "",
  canCancel: defaultCanCancel = true,
}: IParams = {}) => {

  const changeRef = useRef<Fn>();
  const [currentCanCancel, setCurrentCanCancel] = useState(defaultCanCancel);
  const [currentTitle, setCurrentTitle] = useState(defaultTitle);
  const [currentMsg, setCurrentMsg] = useState(defaultMsg);

  const handleChange: Fn = (time) => {
    const { current } = changeRef;
    if (current) {
      current(time);
    }
    hideModal();
  };

  const { showModal, hideModal } = useModal(() => (
    <ConfirmPicker
      open
      canCancel={currentCanCancel}
      title={currentTitle}
      msg={currentMsg}
      onChange={handleChange}
    />
  ), [currentTitle, currentMsg, currentCanCancel]);

  return ({
    canCancel,
    title,
    msg,
  }: Partial<IParams> = {}) => new class {
    constructor() {
      canCancel !== undefined && setCurrentCanCancel(canCancel);
      title !== undefined && setCurrentTitle(title);
      msg  !== undefined && setCurrentMsg(msg);
      showModal();
    };
    then(onData: Fn) {
      changeRef.current = onData;
    };
  }();

};

export default useConfirm;

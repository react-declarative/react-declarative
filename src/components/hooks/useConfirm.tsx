import * as React from 'react';
import { useState, useRef } from 'react';

import { useModal } from 'react-modal-hook';

import ConfirmPicker from '../common/ConfirmPicker';

type Fn = (result: boolean) => void;

interface IParams {
  title?: string;
  msg?: string;
}

export const useConfirm = ({
  title: defaultTitle = "",
  msg: defaultMsg = "",
}: IParams = {}) => {

  const changeRef = useRef<Fn>();
  const [currentTitle, setCurrentTitle] = useState(defaultTitle);
  const [currentMsg, setCurrentMsg] = useState(defaultMsg);

  const handleChange: Fn = (time) => {
    const { current } = changeRef;
    if (current) {
      current(time);
    }
    hideModal();
  };

  const [showModal, hideModal] = useModal(({ in: open }) => (
    <ConfirmPicker
      open={open}
      title={currentTitle}
      msg={currentMsg}
      onChange={handleChange}
    />
  ), [currentTitle, currentMsg]);

  return ({
    title,
    msg,
  }: Partial<IParams> = {}) => new class {
    constructor() {
      title && setCurrentTitle(title);
      msg && setCurrentMsg(msg);
      showModal();
    };
    then(onData: Fn) {
      changeRef.current = onData;
    };
  }();

};

export default useConfirm;

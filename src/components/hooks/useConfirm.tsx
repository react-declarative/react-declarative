import * as React from 'react';
import { useRef } from 'react';

import { useModal } from 'react-modal-hook';

import ConfirmPicker from '../common/ConfirmPicker';

type Fn = (result: boolean) => void;

interface IParams {
  title: string;
  msg: string;
}

export const useConfirm = ({
  title,
  msg,
}: IParams) => {

  const changeRef = useRef<Fn>();

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
      title={title}
      msg={msg}
      onChange={handleChange}
    />
  ));

  return () => new class {
    constructor() {
      showModal();
    };
    then(onData: Fn) {
      changeRef.current = onData;
    };
  }();

};

export default useConfirm;

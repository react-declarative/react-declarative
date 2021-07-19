import * as React from 'react';
import { useRef } from 'react';

import { useModal } from 'react-modal-hook';
import dayjs from 'dayjs';

import TimePicker from '../common/TimePicker';

type Fn = (d: dayjs.Dayjs | null) => void;

export const useTime = () => {

  const changeRef = useRef<Fn>();

  const handleChange: Fn = (time) => {
    const { current } = changeRef;
    if (current) {
      current(time);
    }
    hideModal();
  };

  const [showModal, hideModal] = useModal(({ in: open }) => (
    <TimePicker
      open={open}
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

export default useTime;

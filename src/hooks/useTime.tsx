import * as React from 'react';
import { useRef } from 'react';

import { useModal } from '../components/ModalProvider';
import dayjs from 'dayjs';

import TimePicker from '../components/common/TimePicker';

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

  const { showModal, hideModal } = useModal(() => (
    <TimePicker
      open
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

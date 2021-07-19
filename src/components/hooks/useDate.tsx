import * as React from 'react';
import { useRef } from 'react';

import { useModal } from 'react-modal-hook';
import dayjs from 'dayjs';

import DatePicker from '../common/DatePicker';

type Fn = (d: dayjs.Dayjs | null) => void;

export const useDate = () => {

  const changeRef = useRef<Fn>();

  const handleChange: Fn = (date) => {
    const { current } = changeRef;
    if (current) {
      current(date);
    }
    hideModal();
  };

  const [showModal, hideModal] = useModal(({ in: open }) => (
    <DatePicker
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

export default useDate;

import * as React from 'react';
import { useRef } from 'react';

import { useModal } from '../components/ModalProvider';
import dayjs from 'dayjs';

import DatePicker from '../components/common/DatePicker';

import Subject from '../utils/rx/Subject';

type Fn = (d: dayjs.Dayjs | null) => void;

/**
 * useDate
 *
 * A custom hook that returns a function for using a modal with a DatePicker component.
 * The returned function can be used to display the modal and retrieve the selected date.
 *
 * @returns A function that can be called to display the modal and retrieve the selected date.
 */
export const useDate = () => {

  const changeRef = useRef<Fn>();

  const handleChange: Fn = (date) => {
    const { current } = changeRef;
    if (current) {
      current(date);
    }
    hideModal();
  };

  const { showModal, hideModal } = useModal(() => (
    <DatePicker
      open
      onChange={handleChange}
    />
  ));

  return () => new class {
    constructor() {
      showModal();
    };
    then = (onData: Fn) => {
      changeRef.current = onData;
    };
    toPromise = async () => {
      const subject = new Subject<dayjs.Dayjs | null>();
      this.then(subject.next);
      return await subject.toPromise();
    };
  }();
};

export default useDate;

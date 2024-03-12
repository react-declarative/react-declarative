import * as React from 'react';
import { useRef } from 'react';

import { useModal } from '../components/ModalProvider';
import dayjs from 'dayjs';

import TimePicker from '../components/common/TimePicker';

import Subject from '../utils/rx/Subject';

type Fn = (d: dayjs.Dayjs | null) => void;

/**
 * useTime is a custom hook/function that provides a time picker modal functionality.
 * It returns an object with methods to interact with the time picker.
 *
 * @returns - A function that returns an object with methods.
 */
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

export default useTime;

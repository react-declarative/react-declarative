import * as React from 'react';
import { useState, useRef } from 'react';

import { useModal } from '../components/ModalProvider';

import PromptPicker from '../components/common/PromptPicker';

import Subject from '../utils/rx/Subject';

type Fn = (result: string | null) => void;

interface IParams {
  title?: string;
  value?: string;
  placeholder?: string;
  canCancel?: boolean;
}

export const usePrompt = ({
  title: defaultTitle = "Prompt",
  value: defaultValue = "",
  placeholder: defaultPlaceholder = "Prompt",
  canCancel: defaultCanCancel = true,
}: IParams = {}) => {

  const changeRef = useRef<Fn>();
  const [currentCanCancel, setCurrentCanCancel] = useState(defaultCanCancel);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(defaultPlaceholder);
  const [currentTitle, setCurrentTitle] = useState(defaultTitle);
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChange: Fn = (value) => {
    const { current } = changeRef;
    if (current) {
      current(value);
    }
    hideModal();
  };

  const { showModal, hideModal } = useModal(() => (
    <PromptPicker
      open
      canCancel={currentCanCancel}
      title={currentTitle}
      value={currentValue}
      placeholder={currentPlaceholder}
      onChange={handleChange}
    />
  ), [currentTitle, currentValue, currentCanCancel, currentPlaceholder]);

  return ({
    canCancel,
    title,
    placeholder,
    value,
  }: Partial<IParams> = {}) => new class {
    constructor() {
      placeholder !== undefined && setCurrentPlaceholder(placeholder);
      canCancel !== undefined && setCurrentCanCancel(canCancel);
      title !== undefined && setCurrentTitle(title);
      value  !== undefined && setCurrentValue(value);
      showModal();
    };
    then = (onData: Fn) => {
      changeRef.current = onData;
    };
    toPromise = async () => {
      const subject = new Subject<string | null>();
      this.then(subject.next);
      return await subject.toPromise();
    };
  }();

};

export default usePrompt;

import * as React from 'react';
import { useState, useRef } from 'react';

import { useModal } from 'react-modal-hook';

import OnePicker from '../common/OnePicker';

import IField from '../../model/IField';
import IAnything from '../../model/IAnything';
import TypedField from '../../model/TypedField';
import { OneHandler } from '../../model/IOneProps';

type Fn<Data = IAnything> = (d: Data | null) => void;

interface IParams<Data extends IAnything = IAnything, Field = IField<Data>> {
  fields: Field[];
  title?: string;
  handler?: OneHandler<Data>;
}

export const useOne = <Data extends IAnything = IAnything, Field = IField<Data>>({
  fields,
  title: defaultTitle,
  handler: defaultHandler,
}: IParams<Data, Field>) => {

  const changeRef = useRef<Fn>();

  const [currentHandler, setCurrentHandler] = useState(() => defaultHandler);
  const [currentTitle, setCurrentTitle] = useState(defaultTitle);

  const handleChange: Fn = (date) => {
    const { current } = changeRef;
    if (current) {
      current(date);
    }
    hideModal();
  };

  const [showModal, hideModal] = useModal(({ in: open }) => (
    <OnePicker
      open={open}
      fields={fields as unknown as IField[]}
      title={currentTitle}
      handler={currentHandler}
      onChange={handleChange}
    />
  ), [currentTitle, currentHandler]);

  return ({
    handler,
    title,
  }: Partial<IParams<Data, Field>> = {}) => new class {
    constructor() {
      handler !== undefined && setCurrentHandler(() => handler);
      title !== undefined && setCurrentTitle(title);
      showModal();
    };
    then(onData: Fn) {
      changeRef.current = onData;
    };
  }();
};

export const useOneTyped = <Data extends IAnything = IAnything>(params: IParams<Data, TypedField<Data>>) =>
  useOne(params);

export default useOne;

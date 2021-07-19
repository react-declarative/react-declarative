import * as React from 'react';
import { useRef } from 'react';

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
  title,
  handler,
}: IParams<Data, Field>) => {

  const changeRef = useRef<Fn>();

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
      title={title}
      handler={handler}
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

export const useOneTyped = <Data extends IAnything = IAnything>(params: IParams<Data, TypedField<Data>>) =>
  useOne(params);

export default useOne;

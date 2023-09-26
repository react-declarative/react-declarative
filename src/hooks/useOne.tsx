import * as React from 'react';
import { useRef } from 'react';

import { useModal } from '../components/ModalProvider';

import OnePicker from '../components/common/OnePicker';

import IField from '../model/IField';
import IAnything from '../model/IAnything';
import TypedField from '../model/TypedField';
import IOneProps, { OneHandler } from '../model/IOneProps';
import IOnePublicProps from '../model/IOnePublicProps';

import useActualState from './useActualState';

import Subject from '../utils/rx/Subject';

type Fn<Data = IAnything> = (d: Data | null) => void;

interface IParams<Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data, Payload>> {
  fields: Field[];
  title?: string;
  handler?: OneHandler<Data, Payload>;
  payload?: IOneProps<Data, Payload, Field>['payload'];
  features?: IOnePublicProps<Data, Payload, Field>['features'];
  waitForChangesDelay?: number;
}

export const useOne = <Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data, Payload>>({
  fields,
  title: defaultTitle,
  handler: defaultHandler,
  payload: defaultPayload,
  waitForChangesDelay,
  features,
}: IParams<Data, Payload, Field>) => {

  const changeRef = useRef<Fn>();

  const [currentHandler, setCurrentHandler] = useActualState(() => defaultHandler);
  const [currentPayload, setCurrentPayload] = useActualState(() => defaultPayload);
  const [currentTitle, setCurrentTitle] = useActualState(defaultTitle);

  const handleChange: Fn = (date) => {
    const { current } = changeRef;
    if (current) {
      current(date);
    }
    hideModal();
  };

  const { showModal, hideModal } = useModal(() => (
    <OnePicker
      open
      waitForChangesDelay={waitForChangesDelay}
      fields={fields as unknown as IField[]}
      title={currentTitle.current}
      handler={currentHandler.current}
      payload={currentPayload.current}
      onChange={handleChange}
      features={features}
    />
  ), [currentTitle, currentHandler]);

  return ({
    handler,
    payload,
    title,
  }: Partial<IParams<Data, Payload, Field>> = {}) => new class {
    constructor() {
      handler !== undefined && setCurrentHandler(() => handler);
      title !== undefined && setCurrentTitle(title);
      payload !== undefined && setCurrentPayload(payload);
      showModal();
    };
    then = (onData: Fn) => {
      changeRef.current = onData;
    };
    toPromise = async () => {
      const subject = new Subject<Data | null>();
      this.then(subject.next);
      return await subject.toPromise();
    };
  }();
};

export const useOneTyped = <Data extends IAnything = IAnything, Payload = IAnything>(params: IParams<Data, Payload, TypedField<Data, Payload>>) =>
  useOne(params);

export default useOne;

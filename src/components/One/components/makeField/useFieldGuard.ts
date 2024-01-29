import { useMemo } from "react";

import trycatch from "../../../../utils/hof/trycatch";

import IField from "../../../../model/IField";

interface IChunk {
  prefix: string;
  name: string;
  isDisabled: IField["isDisabled"];
  isVisible: IField["isVisible"];
  isInvalid: IField["isInvalid"];
  isIncorrect: IField["isIncorrect"];
  isReadonly: IField["isReadonly"];
}

interface IResult {
  isDisabled: Exclude<IField["isDisabled"], undefined>;
  isVisible: Exclude<IField["isVisible"], undefined>;
  isInvalid: Exclude<IField["isInvalid"], undefined>;
  isIncorrect: Exclude<IField["isIncorrect"], undefined>;
  isReadonly: Exclude<IField["isReadonly"], undefined>;
}

const DEFAULT_IS_DISABLED = () => false;
const DEFAULT_IS_VISIBLE = () => true;
const DEFAULT_IS_INVALID = () => null;
const DEFAULT_IS_INCORRECT = () => null;
const DEFAULT_IS_READONLY = () => false;

const createFallback = (name: string, prefix: string, source: string) => {
  const fieldName = `${prefix}(${name || 'unknown'})`;
  return (error: Error) => {
    console.error(`react-declarative ${fieldName} ${source} exception`, error);
  };
};

export const useFieldGuard = ({
  prefix,
  name,
  isDisabled = DEFAULT_IS_DISABLED,
  isVisible = DEFAULT_IS_VISIBLE,
  isInvalid = DEFAULT_IS_INVALID,
  isIncorrect = DEFAULT_IS_INCORRECT,
  isReadonly = DEFAULT_IS_READONLY,
}: IChunk): IResult =>
  useMemo(
    () => ({
      isDisabled: trycatch(isDisabled, {
        defaultValue: false,
        fallback: createFallback(name, prefix, "isDisabled"),
      }) as IResult["isDisabled"],
      isVisible: trycatch(isVisible, {
        defaultValue: false,
        fallback: createFallback(name, prefix, "isVisible"),
      }) as IResult["isVisible"],
      isInvalid: trycatch(isInvalid, {
        defaultValue: null,
        fallback: createFallback(name, prefix, "isInvalid"),
      }) as IResult["isInvalid"],
      isIncorrect: trycatch(isIncorrect, {
        defaultValue: null,
        fallback: createFallback(name, prefix, "isIncorrect"),
      }) as IResult["isIncorrect"],
      isReadonly: trycatch(isReadonly, {
        defaultValue: false,
        fallback: createFallback(name, prefix, "isReadonly"),
      }) as IResult["isReadonly"],
    }),
    []
  );

export default useFieldGuard;

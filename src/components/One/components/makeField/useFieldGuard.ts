import { useMemo } from "react";
import IField from "../../../../model/IField";
import trycatch from "../../../../utils/hof/trycatch";

interface IChunk {
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

export const useFieldGuard = ({
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
      }) as IResult["isDisabled"],
      isVisible: trycatch(isVisible, {
        defaultValue: false,
      }) as IResult["isVisible"],
      isInvalid: trycatch(isInvalid, {
        defaultValue: null,
      }) as IResult["isInvalid"],
      isIncorrect: trycatch(isIncorrect, {
        defaultValue: null,
      }) as IResult["isIncorrect"],
      isReadonly: trycatch(isReadonly, {
        defaultValue: false,
      }) as IResult["isReadonly"],
    }),
    []
  );

export default useFieldGuard;

import { useMemo } from "react";

import trycatch from "../../../../../utils/hof/trycatch";

import IField from "../../../../../model/IField";

/**
 * Represents a chunk of data.
 *
 * @interface IChunk
 */
interface IChunk {
  prefix: string;
  name: string;
  isDisabled: IField["isDisabled"];
  isVisible: IField["isVisible"];
  isInvalid: IField["isInvalid"];
  isIncorrect: IField["isIncorrect"];
  isReadonly: IField["isReadonly"];
}

/**
 * Represents the result of a field's validation.
 *
 * @interface IResult
 */
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

/**
 * Creates a fallback function.
 *
 * @param name - The name of the fallback function.
 * @param prefix - The prefix to be added to the name.
 * @param source - The source of the fallback function.
 * @returns - The fallback function that logs the error to the console.
 */
const createFallback = (name: string, prefix: string, source: string) => {
  const fieldName = `${prefix}(${name || 'unknown'})`;
  return (error: Error) => {
    console.error(`react-declarative ${fieldName} ${source} exception`, error);
  };
};

/**
 * Creates a guard for field properties.
 *
 * @param options - The options object.
 * @param options.prefix - The prefix for the field.
 * @param options.name - The name of the field.
 * @param [options.isDisabled] - Indicates if the field is disabled. Defaults to `DEFAULT_IS_DISABLED`.
 * @param [options.isVisible] - Indicates if the field is visible. Defaults to `DEFAULT_IS_VISIBLE`.
 * @param [options.isInvalid] - Indicates if the field is invalid. Defaults to `DEFAULT_IS_INVALID`.
 * @param [options.isIncorrect] - Indicates if the field is incorrect. Defaults to `DEFAULT_IS_INCORRECT`.
 * @param [options.isReadonly] - Indicates if the field is readonly. Defaults to `DEFAULT_IS_READONLY`.
 * @returns - The result object with guarded field properties.
 */
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

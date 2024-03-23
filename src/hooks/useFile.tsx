import React from 'react';
import { useRef } from 'react';

/**
 * Represents a set of parameters for a function or method.
 *
 * @interface
 */
interface IParams {
  accept?: string;
  onSelect?: (...files: File[]) => void;
}

/**
 * Represents and provides functionality for a file input element.
 */
export const useFile = ({
  accept,
  onSelect,
}: IParams) => {
  const inputRef = useRef<HTMLInputElement>(null)
  /**
   * Handles the 'onChange' event of an input element.
   *
   * This function is responsible for retrieving the selected files from an input element,
   * calling the 'onSelect' function with the selected files as arguments, and then clearing
   * the input element's value.
   *
   * @returns This function does not return a value.
   */
  const onChange = () => {
    const files = inputRef.current?.files;
    if (!files?.length) {
      return;
    } else {
      onSelect && onSelect(...Array.from(files))
      inputRef.current && (inputRef.current.value = '')
    }
  };
  /**
   * Renders a file input element with specified attributes.
   *
   * @returns The rendered file input element.
   */
  const render = () => (
    <input
      type="file"
      style={{ display: 'none' }}
      onChange={onChange}
      ref={inputRef}
      accept={accept}
    />
  );
  const open = () => {
    inputRef.current?.click();
  };
  return {
    render,
    open,
  };
};

export default useFile;

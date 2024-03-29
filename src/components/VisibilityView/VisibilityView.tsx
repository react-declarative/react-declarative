import * as React from 'react';
import { useMemo, useCallback } from 'react';

import One from '../One';

import IField from '../../model/IField';
import FieldType from '../../model/FieldType';
import IVisibilityViewProps from './model/IVisibilityViewProps';

import keyToTitleDefault from './utils/keyToTitle';
import getVariantList from './utils/getVariantList';

type Data = Record<string, string[]>;
type State = Record<string, Record<string, boolean>>;

/**
 * Represents the visibility view component.
 *
 * @param VisibilityView - The props for the visibility view component.
 * @param changeSubject - The function to change the subject.
 * @param outlinePaper - Whether to outline the paper.
 * @param transparentPaper - Whether the paper is transparent.
 * @param className - The CSS class name.
 * @param style - The style object.
 * @param sx - The sx prop for emotion/styled.
 * @param expandAll - Whether to expand all fields.
 * @param readonly - Whether the fields are readonly.
 * @param onChange - The function to handle changes.
 * @param groups - The array of field groups.
 * @param data - The data object.
 * @param keyToTitle - The function to convert a key to a title.
 * @returns The visibility view component.
 */
export const VisibilityView = ({
  changeSubject,
  outlinePaper,
  transparentPaper,
  className,
  style,
  sx,
  expandAll,
  readonly,
  onChange,
  groups,
  data,
  keyToTitle = keyToTitleDefault,
}: IVisibilityViewProps) => {

  /**
   * Returns an array of field objects for the given groups.
   *
   * @returns {Array} An array of field objects.
   * @param {Function} useMemo - A memoization function.
   * @param {Function} getVariantList - A function that returns a list of variants.
   * @param {Array} groups - An array of group objects.
   * @param {String} keyToTitle - A function that converts a key to a title.
   * @param {Boolean} expandAll - Indicates whether to expand all fields.
   * @param {Boolean} readonly - Indicates whether the fields are readonly.
   * @returns {Array} An array of field objects.
   */
  const fields = useMemo((): IField[] => groups.map(({
    fields,
    name,
    title,
    description,
  }, idx) => {
    const variantList = getVariantList(fields, keyToTitle);
    return {
      type: FieldType.Expansion,
      fieldBottomMargin: idx === groups.length - 1 ? "0" : "1",
      expansionOpened: expandAll,
      title: title || keyToTitle(name),
      description,
      fields: variantList.map(({ label, value }) => ({
        type: FieldType.Checkbox,
        readonly,
        name: `${name}.${value}`,
        title: `${label} (${value})`,
        defaultValue: false,
      })),
    }
  }), []);

  /**
   * Returns a memoized value based on the given data and groups.
   *
   * @param {Object} data - The data to be processed.
   *
   * @returns {Object} - The memoized value.
   *
   * @typedef {Object} State - Represents the state of the memoized value.
   * @property {Object} [name] - The name property.
   * @property {Object} [name][value] - The value property associated with the name.
   *
   * @typedef {Object[]} Group - Represents a group of fields.
   * @property {string} name - The name of the group.
   * @property {Object[]} fields - The fields in the group.
   *
   * @typedef {Object[]} Variant - Represents a variant of a field.
   * @property {any} value - The value of the variant.
   *
   * @typedef {Object} Field - Represents a field.
   * @property {Variant[]} variants - The variants of the field.
   *
   * @typedef {Object} Data - Represents the data.
   * @property {Object[]} [name] - The data associated with the name.
   */
  const value = useMemo(() => {
    if (!data) {
      return {};
    }
    return groups.reduce<State>((acm, { name, fields }) => {
      const variantList = getVariantList(fields);
      const variantSet = new Set(data[name]);
      return {
        ...acm,
        ...variantList.reduce(
          (acm: any, { value }: any) => ({
            [name]: {
              ...acm[name],
              [value]: variantSet.has(value),
            },
          }), {})
      };
    }, {});
  }, [data]);

  const handler = useCallback(() => value, [data]);

  /**
   * Handles change in state and calls onChange if provided.
   *
   * @param {State} state - The state object.
   * @param {boolean} initial - Indicates whether it is the initial change.
   *
   * @returns {void}
   */
  const handleChange = useCallback((state: State, initial: boolean) => {
    if (initial) {
      return;
    }
    const data: Data = {};
    for (const [key, value] of Object.entries(state)) {
      data[key] = Object.entries(value).filter(([, value]) => value).map(([key]) => key);
    }
    onChange && onChange(data);
  }, []);

  return (
    <One
      className={className}
      outlinePaper={outlinePaper}
      transparentPaper={transparentPaper}
      changeSubject={changeSubject}
      style={style}
      sx={sx}
      handler={handler}
      change={handleChange}
      fields={fields}
    />
  );
};

export default VisibilityView;

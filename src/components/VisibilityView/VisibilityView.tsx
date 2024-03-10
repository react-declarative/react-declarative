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

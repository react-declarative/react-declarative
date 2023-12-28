import * as React from 'react';
import { useMemo, useCallback } from 'react';

import { SxProps } from '@mui/material';

import One from '../One';

import IVisibilityGroup from './model/IVisibilityGroup';
import IField from '../../model/IField';
import FieldType from '../../model/FieldType';

import keyToTitleDefault from './utils/keyToTitle';
import getVariantList from './utils/getVariantList';

type Data = Record<string, string[]>;
type State = Record<string, Record<string, boolean>>;

interface IVisibilityViewProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  data?: Data | null;
  onChange?: (data: Data, initial: boolean) => void;
  groups: IVisibilityGroup[];
  keyToTitle?: (name: string) => string;
}

export const VisibilityView = ({
  className,
  style,
  sx,
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
      title: title || keyToTitle(name),
      description,
      fields: variantList.map(({ label, value }) => ({
        type: FieldType.Checkbox,
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
  }, []);

  const handler = useCallback(() => value, []);

  const handleChange = useCallback((state: State, initial: boolean) => {
    const data: Data = {};
    for (const [key, value] of Object.entries(state)) {
      data[key] = Object.entries(value).filter(([, value]) => value).map(([key]) => key);
    }
    onChange && onChange(data, initial);
  }, []);

  return (
    <One
      className={className}
      style={style}
      sx={sx}
      handler={handler}
      change={handleChange}
      fields={fields}
    />
  );
};

export default VisibilityView;

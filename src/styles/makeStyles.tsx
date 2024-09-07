import { useMemo } from 'react';

import { useTheme } from '@mui/material/styles';
import { Theme } from "@mui/material";
import { css, keyframes, speedy } from 'glamor';

import classNames from '../utils/classNames';

declare module "glamor" {
  export function speedy(mode: boolean): void;
}

interface IStyles {
  [k1: string]: {
    [K in keyof React.CSSProperties | string]: any;
  } & Record<string, any>
}

speedy(true);

type StyleFactory = IStyles | ((theme: Theme) => IStyles);
type CompiledStyles = Record<string, string>;

const styleCache = new WeakMap<StyleFactory, CompiledStyles>();

const compileStyles = (factory: StyleFactory, theme: Theme) => {
  const record = typeof factory === "function" ? factory(theme) : {...factory};
  const classes: Record<string, string> = {};
  Object.entries(record).forEach(([key, value]) => {
    classes[key] = css(value).toString();
  });
  return classes;
};

const getStyles = (factory: StyleFactory, theme: Theme) =>
  styleCache.has(factory)
    ? styleCache.get(factory)!
    : styleCache
      .set(factory, compileStyles(factory, theme))
      .get(factory)!

export const makeStyles = () => (factory: StyleFactory) => {
  return () => {
    const theme = useTheme();
    return useMemo(() => ({
      classes: getStyles(factory, theme),
      cx: classNames,
    }), []);
  };
};

export { useTheme, keyframes };

export default makeStyles;

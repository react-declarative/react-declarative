import { useTheme } from '@mui/material/styles';
import { Theme } from "@mui/material";

import { css, keyframes } from 'glamor';
import { useMemo } from 'react';
import classNames from '../utils/classNames';

interface IStyles {
  [key: string]: Record<string, any>;
}

export const makeStyles = () => (factory: IStyles | ((theme: Theme) => IStyles)) => {
  return () => {
    const theme = useTheme();
    return useMemo(() => {
      const record = typeof factory === "function" ? factory(theme) : {...factory};
      const classes: Record<string, string> = {};
      Object.entries(record).forEach(([key, value]) => {
        record[key] = css(value);
      });
      return { classes, cx: classNames };
    }, []);
  };
}

export { useTheme, keyframes };

export default makeStyles;

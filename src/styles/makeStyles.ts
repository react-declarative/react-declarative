import { useTheme } from '@mui/material/styles';

import { createMakeAndWithStyles, keyframes } from 'tss-react';

export const { makeStyles } = createMakeAndWithStyles({
  useTheme,
});

export { useTheme, keyframes };

export default makeStyles;

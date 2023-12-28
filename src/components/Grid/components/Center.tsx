import * as React from 'react';
import { SxProps } from '@mui/material';

import Box from '@mui/material/Box';

interface ICenterProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  children: React.ReactNode;
}

export const Center = ({ className, style, sx, children }: ICenterProps) => (
  <Box
    className={className}
    style={style}
    sx={{
      ...sx,
      display: 'flex',
      justifyContent: 'center !important',
      alignItems: 'center !important',
    }}
  >
    {children}
  </Box>
);

export default Center;

import * as React from 'react';
import { SxProps } from '@mui/material';

import Box from '@mui/material/Box';

/**
 * Interface representing the props for the Center component.
 * @interface ICenterProps
 */
interface ICenterProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  children: React.ReactNode;
}

/**
 * Represents a component that centers its children horizontally and vertically.
 *
 * @param props - The properties of the component.
 * @param props.className - The class name for the component.
 * @param props.style - The inline style for the component.
 * @param props.sx - The style object for the component, using the sx prop from theme-ui.
 * @param props.children - The children elements to be centered.
 * @returns The Center component.
 */
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

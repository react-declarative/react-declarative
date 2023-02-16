import * as React from 'react';
import { useMemo } from 'react';

import LinearProgress from '@mui/material/LinearProgress';

import useGridProps from '../hooks/useGridProps';
import useContainerSize from '../hooks/useContainerSize';

import { ACTIONS_WIDTH } from '../config';

export const Loader = () => {
  const { width: fullWidth } = useContainerSize();
  const { rowActions } = useGridProps();
  const containerWidth = useMemo(() => Math.max(fullWidth - (rowActions ? ACTIONS_WIDTH : 0), 0), [fullWidth, rowActions]);
  return (
    <LinearProgress
      sx={{
        width: `${containerWidth}px`,
        marginLeft: '-1px',
        marginTop: '-4px',
        zIndex: 10,
      }}
    />
  );
};

export default Loader;

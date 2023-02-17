import * as React from 'react';

import LinearProgress from '@mui/material/LinearProgress';

import useContainerSize from '../hooks/useContainerSize';

export const Loader = () => {
  const { width } = useContainerSize();
  return (
    <LinearProgress
      sx={{
        width: `${width}px`,
        marginLeft: '-1px',
        marginTop: '-4px',
        zIndex: 10,
      }}
    />
  );
};

export default Loader;

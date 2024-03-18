import * as React from 'react';

import Typography from "@mui/material/Typography";

/**
 * Represents a view component for displaying an error message.
 * @return The rendered view component.
 */
export const ErrorView = () => {
  return (
    <Typography
      sx={{ height: 275, width: "100%", whiteSpace: "wrap" }}
      color="red"
      variant="body1"
    >
      An error aquired while downloading a preview
    </Typography>
  );
};

export default ErrorView;

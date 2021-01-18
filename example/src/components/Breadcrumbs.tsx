import React from 'react';

import { Box, Breadcrumbs as MatBreadcrumbs, Button, Link, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    flexDirection: "row",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  stretch: {
    flexGrow: 1,
    shrink: 1,
  },
});

export const Breadcrumbs = ({
  save = () => null,
  disabled = true,
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <MatBreadcrumbs className={classes.stretch} aria-label="breadcrumb">
        <Link color="inherit">Some page</Link>
        <Typography color="textPrimary">Another page</Typography>
      </MatBreadcrumbs>
      <Button
        onClick={save}
        color="primary"
        disabled={disabled}
        variant="contained"
      >
        Save
      </Button>
    </Box>
  );
};

export default Breadcrumbs;

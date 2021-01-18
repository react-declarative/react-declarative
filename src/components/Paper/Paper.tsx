import * as React from 'react';

import { makeStyles, Paper as MatPaper, Box } from '@material-ui/core';

import Group, { IGroupProps } from '../Group';

import classNames from '../../utils/classNames';

const useStyles = makeStyles((theme) => ({
  strech: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  content: {
    flexGrow: 1,
    width: "100%",
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "& $content": {
      marginRight: "initial",
      marginBottom: "initial",
    },
  },
}));

export interface IPaperProps extends IGroupProps { }

interface IPaperPrivate {
    children: React.ReactChild;
}

export const Paper = ({
  className = "",
  columns = "",
  phoneColumns = "",
  tabletColumns = "",
  desktopColumns = "",
  children,
  ...otherProps
}: IPaperProps & IPaperPrivate) => {
  const classes = useStyles();
  return (
    <Group
      className={classNames(className, classes.strech)}
      columns={columns}
      {...otherProps}
      phoneColumns={phoneColumns}
      tabletColumns={tabletColumns}
      desktopColumns={desktopColumns}
    >
      <MatPaper className={classNames(classes.content, classes.strech)}>
        <Box p={2} className={classes.content}>
          <Group>{children}</Group>
        </Box>
      </MatPaper>
    </Group>
  );
};

export default Paper;

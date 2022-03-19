import * as React from 'react';

import { Paper as MatPaper, Box } from '@mui/material';

import { makeStyles } from '../../../styles';

import Group from '../Group';

import classNames from '../../../utils/classNames';

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

const useStyles = makeStyles({
  strech: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  content: {
    flexGrow: 1,
    width: "100%",
  },
});

export interface IPaperProps<Data = IAnything> {
  className?: PickProp<IField<Data>, 'className'>;
  style?: PickProp<IField<Data>, 'style'>;
}

interface IPaperPrivate<Data = IAnything> {
  children: React.ReactChild;
  columnsOverride?: PickProp<IField<Data>, 'columnsOverride'>;
}

export const Paper = ({
  className = "",
  style,
  children,
  columnsOverride,
}: IPaperProps & IPaperPrivate) => {
  const classes = useStyles();
  return (
    <MatPaper className={classNames(className, classes.strech)} style={style}>
      <Box className={classes.content}>
        <Group
          columnsOverride={columnsOverride}
          fieldBottomMargin="0"
          fieldRightMargin="0"
        >
          {children}
        </Group>
      </Box>
    </MatPaper>
  );
};

Paper.displayName = 'Paper';

export default Paper;

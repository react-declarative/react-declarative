import * as React from 'react';

import { Box } from '@mui/material';

import { makeStyles } from '../../../styles';

import Group from '../Group';

import classNames from '../../../utils/classNames';

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

const useStyles = makeStyles()({
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

export interface IOutlineProps<Data = IAnything, Payload = IAnything> {
  className?: PickProp<IField<Data, Payload>, 'className'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
}

interface IOutlinePrivate<Data = IAnything, Payload = IAnything> {
  children: React.ReactNode;
  columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
  sx?: PickProp<IField<Data, Payload>, 'sx'>;
  isBaselineAlign: boolean;
}

export const Outline = ({
  className = "",
  columnsOverride,
  style,
  children,
  isBaselineAlign,
  sx,
}: IOutlineProps & IOutlinePrivate) => {
  const { classes } = useStyles();
  return (
    <Box className={classNames(className, classes.strech)} sx={sx} style={style}>
      <Box className={classes.content}>
        <Group
          isBaselineAlign={isBaselineAlign}
          columnsOverride={columnsOverride}
          fieldBottomMargin="0"
          fieldRightMargin="0"
        >
          {children}
        </Group>
      </Box>
    </Box>
  );
};

Outline.displayName = 'Outline';

export default Outline;

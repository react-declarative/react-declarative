import * as React from 'react';

import { Box } from '@mui/material';

import { alpha } from '@mui/material/styles';
import { makeStyles } from '../../../styles';

import Group from '../Group';

import classNames from '../../../utils/classNames';

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

const useStyles = makeStyles()((theme) => ({
  strech: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    border: `1px solid ${alpha(theme.palette.getContrastText(theme.palette.background.default), 0.23)}`,
    borderRadius: '4px',
  },
  content: {
    flexGrow: 1,
    width: "100%",
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface IOutlineProps<Data = IAnything, Payload = IAnything> {
  className?: PickProp<IField<Data, Payload>, 'className'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
}

interface IOutlinePrivate<Data = IAnything, Payload = IAnything> {
  children: React.ReactNode;
  columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
  sx?: PickProp<IField<Data, Payload>, 'sx'>;
}

export const Outline = ({
  className = "",
  columnsOverride,
  style,
  children,
  sx,
}: IOutlineProps & IOutlinePrivate) => {
  const { classes } = useStyles();
  return (
    <Box className={classNames(className, classes.strech)} style={style}>
      <Box className={classes.content}>
        <Group
          columnsOverride={columnsOverride}
          fieldBottomMargin="0"
          fieldRightMargin="0"
          sx={sx}
        >
          {children}
        </Group>
      </Box>
    </Box>
  );
};

Outline.displayName = 'Outline';

export default Outline;

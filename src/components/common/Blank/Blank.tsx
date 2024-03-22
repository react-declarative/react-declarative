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

/**
 * Represents the properties for the Outline component.
 *
 * @template Data - The type of data used in the component.
 * @template Payload - The type of payload used in the component.
 */
export interface IOutlineProps<Data = IAnything, Payload = IAnything> {
  className?: PickProp<IField<Data, Payload>, 'className'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
}

/**
 * Represents the private interface for the Outline component.
 * @template Data - The type of data used by the Outline component.
 * @template Payload - The type of payload used by the Outline component.
 */
interface IOutlinePrivate<Data = IAnything, Payload = IAnything> {
  children: React.ReactNode;
  columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
  sx?: PickProp<IField<Data, Payload>, 'sx'>;
  isBaselineAlign: boolean;
}

/**
 * Represents an outline component.
 *
 * @function
 * @param props - The component props.
 * @param [props.className=""] - The class name for the component.
 * @param [props.columnsOverride] - Object representing the columns override for the component.
 * @param [props.style] - Object representing the inline style for the component.
 * @param [props.children] - The children elements or components.
 * @param [props.isBaselineAlign] - Flag indicating if the content should be baseline aligned.
 * @param [props.sx] - Object representing the style system props for the component.
 * @returns The rendered outline component.
 */
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

import * as React from 'react';

import { Box } from '@mui/material';

import { alpha } from '@mui/material/styles';
import { makeStyles } from '../../../styles';

import Group from '../Group';

import classNames from '../../../utils/classNames';

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

/**
 * The useStyles variable is used to define custom styles using the makeStyles hook.
 * It returns an object containing CSS styles for the strech and content classes.
 *
 * @type {Object}
 * @property strech - CSS styles for the .strech class.
 * @property content - CSS styles for the .content class.
 */
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
  },
}));

/**
 * Interface for the `Outline` component props.
 *
 * @template Data - The data type of the component.
 * @template Payload - The payload type of the component.
 */
export interface IOutlineProps<Data = IAnything, Payload = IAnything> {
  className?: PickProp<IField<Data, Payload>, 'className'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
}

/**
 * Interface representing a private outline.
 *
 * @template Data - The data type used in the outline.
 * @template Payload - The payload type used in the outline.
 */
interface IOutlinePrivate<Data = IAnything, Payload = IAnything> {
  children: React.ReactNode;
  columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
  sx?: PickProp<IField<Data, Payload>, 'sx'>;
  isBaselineAlign: boolean;
}

/**
 * Render an outline component.
 *
 * @param [className=""] - The class name for the outline component.
 * @param [columnsOverride] - An object representing the column overrides.
 * @param [style] - Inline styles for the outline component.
 * @param children - The content to be rendered within the outline component.
 * @param [isBaselineAlign] - Flag indicating whether to align items to the baseline.
 * @param sx - The custom styling for the outline component using the sx prop.
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

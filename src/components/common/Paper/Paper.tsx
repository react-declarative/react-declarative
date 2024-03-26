import * as React from 'react';

import { Paper as MatPaper, Box } from '@mui/material';

import { makeStyles } from '../../../styles';

import Group from '../Group';

import classNames from '../../../utils/classNames';

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

/**
 * Returns the CSS classes based on the provided styles.
 *
 * @returns {Object} The CSS classes object.
 */
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
 * Represents the props for the Paper component.
 *
 * @template Data - The type of data used by the component.
 * @template Payload - The type of payload used by the component.
 */
export interface IPaperProps<Data = IAnything, Payload = IAnything> {
  className?: PickProp<IField<Data, Payload>, 'className'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
}

/**
 * The `IPaperPrivate` interface is used to describe a private paper component.
 *
 * @template Data - The type of data for the paper component.
 * @template Payload - The type of payload for the paper component.
 */
interface IPaperPrivate<Data = IAnything, Payload = IAnything> {
  children: React.ReactNode;
  isBaselineAlign: boolean;
  columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
  sx?: PickProp<IField<Data, Payload>, 'sx'>;
}

/**
 * Represents a Paper component that displays a block of content with a paper-like background.
 *
 * @typedef {Object} Paper
 * @param [className=""] - The additional CSS class name(s) to apply to the Paper component.
 * @param [style] - The inline style object to apply to the Paper component.
 * @param children - The content to be rendered inside the Paper component.
 * @param columnsOverride - The number of columns to override the default layout.
 * @param isBaselineAlign - Specifies whether to align the child elements on the baseline.
 * @param sx - The custom style object to apply to the Paper component using sx prop from the Material-UI theme.
 *
 * @returns - The rendered Paper component.
 */
export const Paper = ({
  className = "",
  style,
  children,
  columnsOverride,
  isBaselineAlign,
  sx,
}: IPaperProps & IPaperPrivate) => {
  const { classes } = useStyles();
  return (
    <MatPaper sx={sx} className={classNames(className, classes.strech)} style={style}>
      <Box className={classes.content}>
        <Group
          columnsOverride={columnsOverride}
          isBaselineAlign={isBaselineAlign}
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

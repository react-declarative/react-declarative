import * as React from 'react';
import { useState } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import { makeStyles } from '../../../styles';

import Group from '../Group';

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

const useStyles = makeStyles()((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

/**
 * Represents the properties for the Expansion component.
 *
 * @template Data - The type of data associated with the component.
 * @template Payload - The type of payload associated with the component.
 */
export interface IExpansionProps<Data = IAnything, Payload = IAnything> {
  title?: PickProp<IField<Data, Payload>, 'title'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
  description?: PickProp<IField<Data, Payload>, 'description'>;
  className?: PickProp<IField<Data, Payload>, 'className'>;
  expansionOpened?: PickProp<IField<Data, Payload>, 'expansionOpened'>;
}

/**
 * Interface for private expansion components.
 *
 * @template Data - The type of data.
 * @template Payload - The type of payload.
 */
interface IExpansionPrivate<Data = IAnything,  Payload = IAnything> {
  children: React.ReactNode;
  columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
  sx?: PickProp<IField<Data, Payload>, 'sx'>;
  isBaselineAlign: boolean;
}

/**
 * Expansion component used for creating expandable sections in UI.
 *
 * @param props - The props for the Expansion component.
 * @param props.title - The title of the expansion section.
 * @param props.description - The description of the expansion section.
 * @param props.className - The CSS class name for the expansion section.
 * @param props.columnsOverride - Override columns for Group component.
 * @param props.isBaselineAlign - Specifies if the content of the expansion section should be baseline-aligned.
 * @param props.sx - The style object for the expansion section.
 * @param props.style - The inline style object for the expansion section.
 * @param props.children - The content of the expansion section.
 * @param props.expansionOpened - Specifies if the expansion section should be initially expanded.
 * @returns The rendered Expansion component.
 */
export const Expansion = ({
  title = '',
  description = '',
  className = '',
  columnsOverride,
  isBaselineAlign,
  sx,
  style,
  children,
  expansionOpened,
}: IExpansionProps & IExpansionPrivate) => {
  const { classes } = useStyles();
  const [expanded, setExpanded] = useState(expansionOpened);
  return (
    <Accordion sx={sx} expanded={expanded} onChange={() => setExpanded(!expanded)} className={className} style={style}>
      <AccordionSummary sx={{ pointerEvents: 'all' }} expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>{title}</Typography>
        <Typography className={classes.secondaryHeading}>{description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Group isBaselineAlign={isBaselineAlign} columnsOverride={columnsOverride}>
          {children}
        </Group>
      </AccordionDetails>
   </Accordion>
  );
};

Expansion.displayName = 'Expansion';

export default Expansion;

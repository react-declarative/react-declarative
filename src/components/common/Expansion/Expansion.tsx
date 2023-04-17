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

export interface IExpansionProps<Data = IAnything, Payload = IAnything> {
  title?: PickProp<IField<Data, Payload>, 'title'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
  description?: PickProp<IField<Data, Payload>, 'description'>;
  className?: PickProp<IField<Data, Payload>, 'className'>;
  expansionOpened?: PickProp<IField<Data, Payload>, 'expansionOpened'>;
}

interface IExpansionPrivate<Data = IAnything,  Payload = IAnything> {
  children: React.ReactNode;
  columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
  sx?: PickProp<IField<Data, Payload>, 'sx'>;
}

export const Expansion = ({
  title = '',
  description = '',
  className = '',
  columnsOverride,
  sx,
  style,
  children,
  expansionOpened,
}: IExpansionProps & IExpansionPrivate) => {
  const { classes } = useStyles();
  const [expanded, setExpanded] = useState(expansionOpened);
  return (
    <Accordion sx={sx} expanded={expanded} onChange={() => setExpanded(!expanded)} className={className} style={style}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>{title}</Typography>
        <Typography className={classes.secondaryHeading}>{description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Group columnsOverride={columnsOverride}>
          {children}
        </Group>
      </AccordionDetails>
   </Accordion>
  );
};

Expansion.displayName = 'Expansion';

export default Expansion;

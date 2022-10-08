import * as React from 'react';

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

export interface IExpansionProps<Data = IAnything> {
  title?: PickProp<IField<Data>, 'title'>;
  style?: PickProp<IField<Data>, 'style'>;
  description?: PickProp<IField<Data>, 'description'>;
  className?: PickProp<IField<Data>, 'className'>;
}

interface IExpansionPrivate<Data = IAnything> {
  children: React.ReactNode;
  columnsOverride?: PickProp<IField<Data>, 'columnsOverride'>;
  sx?: PickProp<IField<Data>, 'sx'>;
}

export const Expansion = ({
  title = '',
  description = '',
  className = '',
  columnsOverride,
  sx,
  style,
  children,
}: IExpansionProps & IExpansionPrivate) => {
  const { classes } = useStyles();
  return (
    <Accordion className={className} style={style}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>{title}</Typography>
        <Typography className={classes.secondaryHeading}>{description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Group columnsOverride={columnsOverride} sx={sx}>
          {children}
        </Group>
      </AccordionDetails>
   </Accordion>
  );
};

Expansion.displayName = 'Expansion';

export default Expansion;

import * as React from 'react';

import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

import Group from '../Group';

import { PickProp } from '../../model/IManaged';
import IField from '../../model/IField';

const useStyles = makeStyles((theme) => ({
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

export interface IExpansionProps {
  title?: PickProp<IField, 'title'>;
  style?: PickProp<IField, 'style'>;
  description?: PickProp<IField, 'description'>;
  className?: PickProp<IField, 'className'>;
}

interface IExpansionPrivate {
  children: React.ReactChild;
}

export const Expansion = ({
  title = '',
  description = '',
  className = '',
  style,
  children,
}: IExpansionProps & IExpansionPrivate) => {
  const classes = useStyles();
  return (
    <Accordion className={className} style={style}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>{title}</Typography>
        <Typography className={classes.secondaryHeading}>{description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Group>
          {children}
        </Group>
      </AccordionDetails>
   </Accordion>
  );
};

Expansion.displayName = 'Expansion';

export default Expansion;

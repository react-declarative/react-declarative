import * as React from 'react';

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles, Typography } from '@material-ui/core';
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
    <ExpansionPanel className={className} style={style}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>{title}</Typography>
        <Typography className={classes.secondaryHeading}>{description}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Group>
          {children}
        </Group>
      </ExpansionPanelDetails>
   </ExpansionPanel>
  );
};

Expansion.displayName = 'Expansion';

export default Expansion;

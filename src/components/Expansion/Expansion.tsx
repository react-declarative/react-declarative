import * as React from 'react';

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

import Group, { IGroupProps } from '../Group';

import { PickProp } from '../../model/IManaged';
import IField from '../../model/IField';

import classNames from '../../utils/classNames';

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
  stretch: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },
  content: {
    flexGrow: 1,
    width: '100%',
  },
}));

export interface IExpansionProps extends IGroupProps {
  title?: PickProp<IField, 'title'>,
  description?: PickProp<IField, 'description'>,
  className?: PickProp<IField, 'className'>,
}

interface IExpansionPrivate {
  children: React.ReactChild;
}

export const Expansion = ({
  title = '',
  description = '',
  className = '',
  style,
  columns,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  fieldRightMargin,
  fieldBottomMargin,
  children,
  ...otherProps
}: IExpansionProps & IExpansionPrivate) => {
  const classes = useStyles();
  return (
    <Group
      className={classNames(className, classes.stretch)}
      style={style}
      columns={columns}
      phoneColumns={phoneColumns}
      tabletColumns={tabletColumns}
      desktopColumns={desktopColumns}
      fieldRightMargin={fieldRightMargin}
      fieldBottomMargin={fieldBottomMargin}
      {...otherProps}
    >
      <ExpansionPanel className={classes.content}>
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
    </Group>
  );
};

export default Expansion;

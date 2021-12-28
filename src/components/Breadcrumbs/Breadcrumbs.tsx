import * as React from 'react';

import { makeStyles } from '@material-ui/core';

import MatBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

import ActionMenu from '../common/ActionMenu';

import IOption from '../../model/IOption';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    flexDirection: "row",
    paddingTop: "10px",
    paddingBottom: "10px",
    flex: 1,
    '& > *:nth-child(n + 1)': {
      marginLeft: theme.spacing(1),
    },
  },
  stretch: {
    flexGrow: 1,
    shrink: 1,
  },
}));

interface IBreadcrumbsProps {
  onSave?: () => void;
  onBack?: () => void;
  onAction?: (action: string) => void;
  actions?: IOption[];
  disabled?: boolean;
  title?: string;
  subtitle?: string;
}

export const Breadcrumbs = ({
  onSave,
  onBack,
  onAction,
  actions,
  disabled,
  title = 'Title',
  subtitle = 'Subtitle',
}: IBreadcrumbsProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <MatBreadcrumbs className={classes.stretch} aria-label="breadcrumb">
        <Link onClick={onBack} color="inherit">{title}</Link>
        <Typography color="textPrimary">{subtitle}</Typography>
      </MatBreadcrumbs>
      <Button
        onClick={onSave}
        color="primary"
        disabled={disabled}
        variant="contained"
      >
        Save
      </Button>
      {!!actions?.length && (
        <ActionMenu
          options={actions}
          onAction={onAction}
        />
      )}
    </Box>
  );
};

export default Breadcrumbs;

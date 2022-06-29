import * as React from 'react';

import { makeStyles } from "../../styles";

import MatBreadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import ActionMenu from '../ActionMenu';

import IOption from '../../model/IOption';

const BREADCRUMBS_SAVE_DELAY = 500;

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

  const handleSave = () => onSave && setTimeout(onSave, BREADCRUMBS_SAVE_DELAY);

  return (
    <Box className={classes.root}>
      <MatBreadcrumbs className={classes.stretch} aria-label="breadcrumb">
        <Link onClick={onBack} color="inherit">{title}</Link>
        <Typography color="textPrimary">{subtitle}</Typography>
      </MatBreadcrumbs>
      <Button
        onClick={handleSave}
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

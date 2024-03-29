import * as React from 'react';

import { makeStyles } from "../../styles";

import MatBreadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import ActionMenu from '../ActionMenu';

import IBreadcrumbsOption from '../../model/IBreadcrumbsOption';

const BREADCRUMBS_SAVE_DELAY = 500;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingTop: "10px",
    paddingBottom: "10px",
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  stretch: {
    flexGrow: 1,
    shrink: 1,
  },
  button: {
    borderRadius: '50px !important',
    minHeight: '40px !important',
    paddingLeft: '15px !important',
    paddingRight: '15px !important',
  },
}));

/**
 * Represents the props for the Breadcrumbs component.
 *
 * @template T - The type of payload.
 *
 * @property [onSave] - The callback function for the save action.
 * @property [onBack] - The callback function for the back action.
 * @property [onAction] - The callback function for custom actions.
 * @property [actions] - The available actions.
 * @property [saveDisabled] - Indicates if the save action is disabled.
 * @property [title] - The title of the breadcrumbs.
 * @property [subtitle] - The subtitle of the breadcrumbs.
 * @property [withSave] - Indicates if the save action is included.
 * @property [payload] - The payload for custom actions.
 * @property [BeforeMenuContent] - The additional content to be displayed before the menu.
 * @property [AfterMenuContent] - The additional content to be displayed after the menu.
 */
interface IBreadcrumbsProps<T extends any = any> {
  onSave?: () => void;
  onBack?: () => void;
  onAction?: (action: string) => void;
  actions?: IBreadcrumbsOption<T>[];
  saveDisabled?: boolean;
  title?: string;
  subtitle?: string;
  withSave?: boolean;
  payload?: T;
  BeforeMenuContent?: React.ComponentType<any>;
  AfterMenuContent?: React.ComponentType<any>;
}

/**
 * Renders a breadcrumb component with optional save button and action menu.
 *
 * @template T - The type of payload used by the actions.
 * @param props - The component props.
 * @param props.onSave - The callback function called when save button is clicked.
 * @param props.onBack - The callback function called when breadcrumb is clicked.
 * @param props.onAction - The callback function called when an action is selected from the menu.
 * @param props.actions - The list of actions to display in the menu.
 * @param props.saveDisabled - Whether the save button should be disabled.
 * @param props.payload - The payload object passed to the actions.
 * @param [props.title='Title'] - The title text for the breadcrumb.
 * @param [props.subtitle='Subtitle'] - The subtitle text for the breadcrumb.
 * @param [props.withSave=false] - Whether the save button should be displayed.
 * @param [props.BeforeMenuContent] - The optional content to display before the action menu.
 * @param [props.AfterMenuContent] - The optional content to display after the action menu.
 * @returns The rendered breadcrumb component.
 */
export const Breadcrumbs = <T extends any = any>({
  onSave,
  onBack,
  onAction,
  actions,
  saveDisabled,
  payload,
  title = 'Title',
  subtitle = 'Subtitle',
  withSave = false,
  BeforeMenuContent,
  AfterMenuContent,
}: IBreadcrumbsProps<T>) => {
  const { classes } = useStyles();

  /**
   * Executes the provided save function after a delay.
   *
   * @function handleSave
   * @returns
   */
  const handleSave = () => onSave && setTimeout(onSave, BREADCRUMBS_SAVE_DELAY);

  return (
    <Box className={classes.root}>
      <MatBreadcrumbs className={classes.stretch} aria-label="breadcrumb">
        <Link sx={{ cursor: 'pointer' }} onClick={onBack} color="inherit">{title}</Link>
        <Typography sx={{ cursor: 'pointer' }} color="textPrimary">{subtitle}</Typography>
      </MatBreadcrumbs>
      {!!withSave && (
        <Button
          className={classes.button}
          variant="contained"
          size="small"
          onClick={handleSave}
          color="primary"
          disabled={saveDisabled}
        >
          Save
        </Button>
      )}
      {!!actions?.length && (
        <ActionMenu
          payload={payload}
          options={actions.map(({
            isVisible = () => true,
            isDisabled = () => false,
            ...other
          }) => ({
            ...other,
            isVisible: () => isVisible(payload!),
            isDisabled: () => isDisabled(payload!),
          }))}
          onAction={onAction}
          BeforeContent={BeforeMenuContent}
          AfterContent={AfterMenuContent}
        />
      )}
    </Box>
  );
};

export default Breadcrumbs;

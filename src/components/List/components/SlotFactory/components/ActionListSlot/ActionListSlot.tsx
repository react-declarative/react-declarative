import * as React from 'react';
import { Fragment } from 'react';

import { makeStyles } from "../../../../../../styles";

import Typography from '@mui/material/Typography';

import classNames from '../../../../../../utils/classNames';

import { IListAction } from '../../../../../../model/IListProps';
import ActionType from '../../../../../../model/ActionType';

import useCachedRows from '../../../../hooks/useCachedRows';
import usePayload from '../../../../hooks/usePayload';
import useProps from '../../../../hooks/useProps';

import { IActionListSlot } from '../../../../slots/ActionListSlot';

import ActionMenu from '../../../../slots/ActionMenuSlot';
import ActionAdd from '../../../../slots/ActionAddSlot';
import ActionFab from '../../../../slots/ActionFabSlot';

/**
 * Hook that creates a custom styles object for a component.
 *
 * @return {object} The styles object.
 */
const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    minHeight: 70,
    '& > *:nth-of-type(n + 1)': {
      marginLeft: theme.spacing(1),
    },
    marginBottom: 5,
  },
  stretch: {
    flex: 1,
  },
  noData: {
    maxHeight: 0,
  },
  title: {
    color: theme.palette.primary.main,
    marginLeft: 'unset !important',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

/**
 * Renders a list of actions with customizable filters.
 *
 * @template FilterData - The type of the filter data.
 *
 * @param props - The props object.
 * @param props.className - The class name of the component.
 * @param props.actions - The array of actions to render.
 * @param props.style - The inline styles for the component.
 * @param props.title - The title of the action list.
 * @param props.height - The height of the action list.
 * @param props.width - The width of the action list.
 * @param [props.deps] - The dependencies array.
 *
 * @returns - The ActionListSlot component.
 *
 * @throws - If the action type is unknown.
 */
export const ActionListSlot = <FilterData extends {}>({
  className,
  actions = [],
  style,
  title,
  height,
  width,
  deps = [],
}: IActionListSlot<FilterData>) => {
  const { classes } = useStyles();

  const { selectedRows } = useCachedRows();
  const { operations } = useProps();
  const payload = usePayload();

  /**
   * Checks if the operations array has any elements.
   *
   * @param operations - The array of operations to check.
   * @returns - True if the operations array has any elements, false otherwise.
   */
  const hasOperations = Array.isArray(operations) && !!operations.length;

  /**
   * Creates an action component based on the given options.
   * @param options - The options for the action.
   * @param options.type - The type of action.
   * @param options.options - The options for the action menu.
   * @param options.isDisabled - Whether the action is disabled.
   * @param options.isVisible - Whether the action is visible.
   * @param options.label - The label of the action.
   * @param options.icon - The icon of the action.
   * @param options.action - The action function.
   * @returns The action component.
   * @throws If the action type is unknown.
   */
  const createAction = ({
    type, 
    options: upperOptions = [],
    isDisabled,
    isVisible,
    label,
    icon,
    action,
  }: IListAction) => {
    if (type === ActionType.Add) {
      return (
        <ActionAdd
          label={label}
          action={action}
          isDisabled={isDisabled}
          isVisible={isVisible}
          height={height}
          width={width}
        />
      );
    } else if (type === ActionType.Fab) {
      return (
        <ActionFab
          label={label}
          action={action}
          icon={icon}
          isDisabled={isDisabled}
          isVisible={isVisible}
          height={height}
          width={width}
        />
      )
    } else if (type === ActionType.Menu) {
      const options = upperOptions.map(({
        isDisabled = () => false,
        isVisible = () => true,
        ...other
      }) => ({
        ...other,
        isDisabled: () => isDisabled(selectedRows, payload),
        isVisible: () => isVisible(selectedRows, payload),
      }));
      return (
        <ActionMenu
          options={options}
          deps={[...deps, payload]}
        />
      );
    } else {
      throw new Error("List Actions unknown action type");
    }
  };

  return (
    <div
      className={classNames(className, classes.root, {
        [classes.noData]: actions.length === 0,
      })}
      style={style}
    >
      <Typography
        className={classes.title}
        variant="h5"
        sx={{
          marginLeft: hasOperations ? '0 !important' : 'inherit',
        }}
      >
        {title}
      </Typography>
      <div className={classes.stretch} />
      {actions.map((action, idx) => (
        <Fragment key={idx}>
          {createAction(action)}
        </Fragment>
      ))}
    </div>
  );
};

export default ActionListSlot;

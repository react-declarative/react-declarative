import * as React from 'react';
import { Fragment } from 'react';

import { makeStyles } from "../../../../styles";

import Typography from '@mui/material/Typography';

import classNames from '../../../../utils/classNames';

import { IListAction } from '../../../../model/IListProps';
import ActionType from '../../../../model/ActionType';
import IAnything from '../../../../model/IAnything';

import useCachedRows from '../../hooks/useCachedRows';
import useProps from '../../hooks/useProps';

import ActionMenu from '../../slots/ActionMenuSlot';
import ActionAdd from '../../slots/ActionAddSlot';
import ActionFab from '../../slots/ActionFabSlot';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    minHeight: 70,
    '& > *:nth-child(n + 1)': {
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
    fontWeight: 'bold',
  },
}));

interface IActionsProps<FilterData = IAnything> {
  className?: string;
  style?: React.CSSProperties;
  filterData: FilterData;
  actions: IListAction[];
  title?: string;
}

export const Actions = <FilterData extends IAnything>({
  className,
  actions,
  style,
  title,
}: IActionsProps<FilterData>) => {
  const classes = useStyles();

  const { selectedRows } = useCachedRows();
  const { operations } = useProps();

  const hasOperations = Array.isArray(operations) && !!operations.length;

  const createAction = ({ 
    type, 
    options: upperOptions = [],
    isDisabled,
    isVisible,
    icon,
    action,
  }: IListAction) => {
    if (type === ActionType.Add) {
      return (
        <ActionAdd
          action={action}
          isDisabled={isDisabled}
          isVisible={isVisible}
        />
      );
    } else if (type === ActionType.Fab) {
      return (
        <ActionFab
          action={action}
          icon={icon}
          isDisabled={isDisabled}
          isVisible={isVisible}
        />
      )
    } else if (type === ActionType.Menu) {
      const options = upperOptions.map(({
        isDisabled = () => false,
        isVisible = () => true,
        ...other
      }) => ({
        ...other,
        isDisabled: () => isDisabled(selectedRows),
        isVisible: () => isVisible(selectedRows),
      }));
      return (
        <ActionMenu
          options={options}
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

export default Actions;

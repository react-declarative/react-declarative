import React from 'react';

import {
  ListTyped,
  FieldType,
  TypedField,
  SelectionMode,
  IColumn,
  IListAction,
  ActionType,
  ColumnType,
  ListHandlerPagination,
  ListHandlerSortModel,
} from 'react-declarative';

import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import mock from './mock/list';

const filters: TypedField[] = [
  {
    type: FieldType.Text,
    name: 'firstName',
    title: 'First name',
  },
  {
    type: FieldType.Text,
    name: 'lastName',
    title: 'Last name',
  }
];

const columns: IColumn[] = [
  {
    type: ColumnType.Text,
    field: 'id',
    headerName: 'ID',
    width: 'max(calc(100vw - 650px), 200px)',
  },
  {
    type: ColumnType.Text,
    field: 'firstName',
    headerName: 'First name',
    width: '200px',
  },
  {
    type: ColumnType.Text,
    field: 'lastName',
    headerName: 'Last name',
    width: '200px',
  },
  {
    type: ColumnType.Action,
    headerName: 'Actions',
    sortable: false,
    width: '150px',
  },
];

const actions: IListAction[] = [
  {
    type: ActionType.Add,
  },
  {
    type: ActionType.Menu,
    options: [
      {
        action: 'add-action',
        label: 'Create new row',
        icon: Add,
      },
    ],
  }
];

const rowActions = [
  {
    label: 'Remove action',
    action: 'remove-action',
    icon: Delete,
  },
];

interface IRowData {
  id: string;
  lastName: string;
  firstName: string;
  color: string;
  age: string;
}

interface IFilterData {
  firstName: string;
  lastName: string;
}

export const ListPage = () => {

  const handler = async ({
    firstName,
    lastName,
  }: IFilterData, {
    limit,
    offset,
  }: ListHandlerPagination, sort: ListHandlerSortModel) => {

    // TODO
    console.log(sort);

    let rows = await Promise.resolve(mock) as IRowData[];

    if (firstName) {
      rows = rows.filter((row) => row.firstName.includes(firstName));
    }

    if (lastName) {
      rows = rows.filter((row) => row.lastName.includes(lastName));
    }

    const { length: total } = rows;

    rows = rows.slice(offset, limit + offset);

    return {
      rows,
      total,
    };
  };

  const heightRequest = () => window.innerHeight - 100;

  const handleColumnMenuClick = (action: string) => {
    alert(action);
  };

  const handleRowActionsClick = (row: any, action: string) => {
    alert(JSON.stringify({ row, action }, null, 2));
  };

  const handleAction = (action: string) => {
    alert(action);
  };

  const handleClick = (row: any) => {
    alert(JSON.stringify({ row }, null, 2));
  };

  return (
    <ListTyped<IFilterData, IRowData>
      title="List Component"
      filterLabel="Filters"
      heightRequest={heightRequest}
      rowActions={rowActions}
      actions={actions}
      filters={filters}
      columns={columns}
      handler={handler}
      selectionMode={SelectionMode.Multiple}
      onColumnMenuAction={handleColumnMenuClick}
      onRowAction={handleRowActionsClick}
      onRowClick={handleClick}
      onAction={handleAction}
      rowColor={row => row.color}
    />
  );
};

export default ListPage;

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
    type: ColumnType.Compute,
    headerName: 'Full name',
    compute: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    width: '200px',
  },
  {
    type: ColumnType.Component,
    headerName: 'Component',
    element: () => (
      <div>
        Custom cell Component
      </div>
    ),
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
      {
        action: 'update-now',
      },
      {
        action: 'auto-reload',
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
      selectionMode={SelectionMode.None}
      onColumnMenuAction={handleColumnMenuClick}
      onRowAction={handleRowActionsClick}
      onRowClick={handleClick}
      onAction={handleAction}
      rowMark={row => row.color}
      rowAvatar={(row) => ({
        alt: row.firstName,
        src: 'https://avatars.githubusercontent.com/u/19227776?s=400&u=9eb4f0056f36228804b7e4c2e4d02358d5786bb4&v=4',
      })}
    />
  );
};

export default ListPage;

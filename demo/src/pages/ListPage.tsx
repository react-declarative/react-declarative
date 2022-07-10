import {
  ListTyped,
  FieldType,
  TypedField,
  SelectionMode,
  IColumn,
  IListAction,
  ActionType,
  ColumnType,
  RowId,
  useList,
  useOne,
  IListChip,
  ListHandlerChips,
  useArrayPaginator,
  IListRowAction,
  ListHandlerPagination,
  ListHandlerSortModel,
  IListOperation,
  useLastPagination,
} from 'react-declarative';

import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';

import mock from './mock/list';
import sleep from '../utils/sleep';
import { useState } from 'react';

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
    secondary: true,
    width: (fullWidth) => Math.max(fullWidth - 650, 200),
    sortable: true,
    columnMenu: [
      {
        action: 'test-action',
        label: 'Column action',
      },
    ],
  },
  /*{
    type: ColumnType.Text,
    field: 'firstName',
    headerName: 'First Name',
    width: 'max(calc(100vw - 650px), 200px)',
  },*/
  {
    type: ColumnType.Compute,
    headerName: 'Full name',
    primary: true,
    compute: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    width: () => '200px',
  },
  {
    type: ColumnType.Component,
    headerName: 'Component',
    phoneHidden: true,
    element: () => (
      <div>
        Custom cell Component
      </div>
    ),
    width: () => '200px',
  },
  {
    type: ColumnType.Action,
    phoneOrder: -1,
    headerName: 'Actions',
    sortable: false,
    width: () => '150px',
  },
];

const actions: IListAction[] = [
  {
    type: ActionType.Add,
    label: 'Create item'
  },
  {
    type: ActionType.Fab,
    label: 'Settings',
  },
  {
    type: ActionType.Menu,
    options: [
      {
        action: 'add-action',
        label: 'Create new row',
        isDisabled: (rows) => {
          debugger
          return true
        },
        icon: Add,
      },
      {
        action: 'update-now',
      },
      {
        action: 'resort-action',
      },
      {
        action: 'list-action',
        label: 'Pick list',
      },
      {
        action: 'one-action',
        label: 'Pick one',
      },
      {
        action: 'disabled-action',
        isDisabled: async () => {
          console.log('call')
          await sleep(5_000)
          return true
        },
        label: 'Disabled',
      },
      {
        action: 'disabled-action',
        isVisible: () => false,
        label: 'Hidden',
      },
    ],
  }
];

const operations: IListOperation[] = [
  {
    action: 'operation-one',
    label: 'Operation one',
  },
  {
    action: 'operation-two',
    label: 'Operation two',
    isAvailable: async (row) => {
      console.log('call', row)
      await sleep(3_000)
      return true
    }
  },
  {
    action: 'operation-three',
    label: 'Operation three',
  },
];

const chips: IListChip[] = [
  {
    label: 'The chip1_enabled is true',
    name: 'chip1_enabled',
    enabled: true,
    color: '#4caf50',
  },
  {
    label: 'The chip2_enabled is true',
    name: 'chip2_enabled',
    color: '#ff9800',
  },
  {
    label: 'The chip3_enabled is true',
    name: 'chip3_enabled',
    color: '#42a5f5',
  }
];

const rowActions: IListRowAction[] = [
  {
    label: 'chip1',
    action: 'chip1-action',
    isVisible: ({ chip1_enabled }) => chip1_enabled,
  },
  {
    label: 'chip2',
    action: 'chip2-action',
    isVisible: ({ chip2_enabled }) => chip2_enabled,
  },
  {
    label: 'chip3',
    action: 'chip3-action',
    isVisible: ({ chip3_enabled }) => chip3_enabled,
  },
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

  const [selectedRows, setSelectedRows] = useState<RowId[]>([]);

  const { data, handler: wrappedHandler } = useLastPagination(({}, {}, {}, {}, {}) => {
    return mock;
  });

  const handler = useArrayPaginator(wrappedHandler);

  const pickerHandler = async ({
    firstName,
    lastName,
  }: IFilterData, {
    limit,
    offset,
  }: ListHandlerPagination, sort: ListHandlerSortModel, chips: ListHandlerChips) => {

    console.log({limit, offset, sort, chips})

    // return mock;

    await sleep(3_000);

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

    //await sleep(3_000)

    // return [];
  };

  const pickList = useList<IRowData>({
    columns,
    handler: pickerHandler,
    selectedRows,
    rowActions,
  });

  const pickOne = useOne({
    fields: [
      {type: FieldType.Text, columns: '6', title: 'Firstname', defaultValue: 'Петр', name: 'f'},
      {type: FieldType.Text, columns: '6', title: 'Lastname', name: 'l'},
    ],
  });

  const heightRequest = () => window.innerHeight - 100;

  const handleRowActionsClick = (action: string, row: any) => {
    alert(JSON.stringify({ row, action }, null, 2));
  };

  const handleAction = (action: string, rows: any) => {
    if (action === 'list-action') {
      pickList({
        title: 'List picker'
      }).then(console.log);
    } else if (action === 'one-action') {
      pickOne({
        title: 'One picker'
      }).then(console.log);
    }
    alert(JSON.stringify({
      action,
      rows,
      data,
    }, null, 2));
  };

  const handleClick = (row: any) => {
    alert(JSON.stringify({ row }, null, 2));
    setSelectedRows((rows) => [...rows, row.id]);
  };

  const handleSelectedRows = (selectedRows: RowId[]) => {
    setSelectedRows(selectedRows);
  };
  
  const handleColumnAction = (field: string, action: string, rows: any[]) => {
    alert(JSON.stringify({ field, action, rows, data }, null, 2))
  };

  const handleOperation = (action: string, rows: any[], isAll: boolean) => {
    alert(JSON.stringify({ action, rows, isAll, data }, null, 2));
  };

  return (
    <ListTyped<IFilterData, IRowData>
      apiRef={(listApi) => (window as any).listApi = listApi}
      title="List Component"
      filterLabel="Filters"
      selectedRows={selectedRows}
      heightRequest={heightRequest}
      rowActions={rowActions}
      actions={actions}
      filters={filters}
      columns={columns}
      handler={handler}
      selectionMode={SelectionMode.Multiple}
      onRowAction={handleRowActionsClick}
      onRowClick={handleClick}
      onAction={handleAction}
      onOperation={handleOperation}
      onSelectedRows={handleSelectedRows}
      onColumnAction={handleColumnAction}
      operations={operations}
      chips={chips}
      withSearch
      withInitialLoader={false}
    />
  );
};

/*
rowMark={row => row.color}
      rowAvatar={(row) => ({
        alt: row.firstName,
        src: 'https://avatars.githubusercontent.com/u/19227776?s=400&u=9eb4f0056f36228804b7e4c2e4d02358d5786bb4&v=4',
      })}
*/

export default ListPage;

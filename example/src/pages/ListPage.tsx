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
  useDate,
  useTime,
  useOne,
  useList,
  pickDateFn,
  pickTimeFn,
  pickOneFn,
  pickListFn
} from 'react-view-builder';

import CalendarToday from '@material-ui/icons/CalendarToday';
import ListAlt from '@material-ui/icons/ListAlt';
import Delete from '@material-ui/icons/Delete';
import Alarm from '@material-ui/icons/Alarm';
import Face from '@material-ui/icons/Face';
import Add from '@material-ui/icons/Add';

const createFilters = (
  pickDate: pickDateFn,
  pickTime: pickTimeFn,
  pickOne: pickOneFn,
  pickList: pickListFn,
): TypedField[]  => [
  {
    type: FieldType.Text,
    title: 'Pick date',
    desktopColumns: '3',
    description: 'By using trailing icon',
    name: 'date',
    trailingIcon: CalendarToday,
    readonly: true,
    trailingIconClick: (_, onChange) => pickDate().then((d) => {
      if (d) {
        onChange(d.format('MM-DD-YYYY'));
      } else {
        onChange('Rejected :-(');
      }
    }),
  },
  {
    type: FieldType.Text,
    title: 'Pick time',
    desktopColumns: '3',
    description: 'By using leading icon',
    name: 'time',
    trailingIcon: Alarm,
    readonly: true,
    defaultValue: '12:00',
    trailingIconClick: (_, onChange) => pickTime().then((t) => {
      if (t) {
        onChange(t.format('H:mm'));
      } else {
        onChange('Rejected :-(');
      }
    }),
  },
  {
    type: FieldType.Text,
    title: 'Pick name',
    desktopColumns: '3',
    description: 'Firstname, Lastname',
    name: 'fio',
    trailingIcon: Face,
    readonly: true,
    trailingIconClick: (_, onChange) => pickOne().then((input) => {
      if (input) {
        const { firstname, lastname } = input;
        onChange([ firstname, lastname ].join(' '));
      } else {
        onChange('Rejected :-(');
      }
    }),
  },
  {
    type: FieldType.Text,
    title: 'Pick list',
    desktopColumns: '3',
    description: 'VIP, BlockList',
    name: 'list',
    trailingIcon: ListAlt,
    readonly: true,
    trailingIconClick: (_, onChange) => pickList().then((input) => {
      if (input && input.length) {
        const [ first ] = input;
        const { label } = first;
        onChange(label);
      } else {
        onChange('Rejected :-(');
      }
    }),
  },
];

const columns: IColumn[] = [
  { 
    type: ColumnType.Text,
    field: 'id',
    headerName: 'ID',
    width: 'max(calc(100vw - 650px), 200px)',
    columnMenu: [
      {
        action: 'click-me',
        label: 'Click me',
      },
    ],
  },
  {
    type: ColumnType.Text,
    field: 'firstName',
    headerName: 'First name',
    width: '200px',
  },
  {
    type: ColumnType.CheckBox,
    field: 'lastName',
    headerName: 'Last name',
    width: '200px',
    sortable: false,
    columnMenu: [
      {
        action: 'hello-action',
        label: 'Hello',
      },
      {
        action: 'world-action',
        label: 'world',
      },
    ]
  },
  {
    type: ColumnType.Action,
    headerName: 'Actions',
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
        action: 'menu-action',
        label: 'Hello world',
        icon: Add,
      }
    ],
  }
];

const rowActions = [
  {
    label: 'Row action',
    action: 'row-action',
    icon: Delete,
  }
];

export const ListPage = () => {

  const pickDate = useDate();
  const pickTime = useTime();

  const pickOne = useOne({
    title: 'Waiting for user input',
    fields: [
      {
        type: FieldType.Text,
        name: 'firstname',
        title: 'First name',
      },
      {
        type: FieldType.Text,
        name: 'lastname',
        title: 'Last name',
      }
    ],
  });

  const pickList = useList({
    title: 'Waiting for user input',
    handler: [
      {
        id: 1,
        label: 'VIP',
      },
      {
        id: 2,
        label: 'BlockList',
      },
    ],
    columns: [
      {
        type: ColumnType.Text,
        field: 'id',
        headerName: 'Id',
        width: '125px',
      },
      {
        type: ColumnType.Text,
        field: 'label',
        headerName: 'Label',
        width: '225px',
      },
    ],
    width: 600,
  });

  const filters = createFilters(pickDate, pickTime, pickOne, pickList);

  const handler = (filterData: any) => {
    console.log({ filterData });
    return [
      { id: "b760df5d-9fb0-4360-a2e6-e3a5356480e6", lastName: 'SnowSnow SnowSnow SnowSnow SnowSnow SnowSnow', firstName: 'Jon', age: 35 },
      { id: "q560df5d-9fb0-4360-a2e6-e3a5356480d5", lastName: 'Lannister', firstName: 'Cersei', age: 42 },
      { id: "b760df5d-9fb0-4360-a2e6-e3a5356120e6", lastName: 'Lannister', firstName: 'Jaime', age: 45 },
      { id: "q560df5d-9fb0-4360-a2e6-e3a5133480d5", lastName: 'Stark', firstName: 'Arya', age: 16 },
    ];
  };

  const heightRequest = () => window.innerHeight - 100;

  const handleColumnMenuClick = (action: string) => {
    alert(action);
  };

  const handleRowActionsClick = (row: any, action: string) => {
    alert(JSON.stringify({row, action}, null, 2));
  };

  const handleAction = (action: string) => {
    alert(action);
  };

  return (
    <ListTyped
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
      onAction={handleAction}
    />
  );
};

export default ListPage;

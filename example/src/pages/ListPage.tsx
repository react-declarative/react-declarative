import React from 'react';

import {
  ListTyped,
  FieldType,
  TypedField,
  IColumn,
  IListAction,
  ActionType,
  ColumnType,
  useDate,
  useTime,
  pickDateFn,
  pickTimeFn,
} from 'react-view-builder';

import CalendarToday from '@material-ui/icons/CalendarToday';
import Alarm from '@material-ui/icons/Alarm';

const createFilters = (pickDate: pickDateFn, pickTime: pickTimeFn): TypedField[]  => [
  {
    type: FieldType.Text,
    title: 'Pick date',
    columns: '4',
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
    columns: '4',
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
];

const columns: IColumn[] = [
  { 
    type: ColumnType.Text,
    field: 'id',
    headerName: 'ID',
    width: 200,
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
    width: 200,
  },
  {
    type: ColumnType.Text,
    field: 'lastName',
    headerName: 'Last name',
    width: 200,
  },
  {
    type: ColumnType.Action,
    headerName: 'Actions',
    width: 150,
  },
];

const actions: IListAction[] = [
  {
    type: ActionType.Add,
    onClick(filterData) {
      console.log(filterData);
    },
  },
];

const rowActions = [
  {
    label: 'Row action',
    action: 'row-action',
  }
];

export const ListPage = () => {

  const pickDate = useDate();
  const pickTime = useTime();

  const filters = createFilters(pickDate, pickTime);

  const handler = (filterData: any) => {
    console.log({ filterData });
    return [
      { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
      { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
      { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
      { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
      { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
      { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
      { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
      { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
      { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];
  };

  const heightRequest = () => window.innerHeight - 100;

  const handleColumnMenuClick = (action: string) => {
    alert(action);
  };

  const handleRowActionsClick = (row: any, action: string) => {
    alert(JSON.stringify({row, action}, null, 2));
  };

  return (
    <ListTyped
      heightRequest={heightRequest}
      rowActions={rowActions}
      actions={actions}
      filters={filters}
      columns={columns}
      handler={handler}
      onColumnMenuAction={handleColumnMenuClick}
      onRowAction={handleRowActionsClick}
    />
  );
};

export default ListPage;

import React from 'react';

import {
    ListTyped,
    FieldType,
    TypedField,
    IListColumns,
    IListAction,
    ActionType,
} from 'react-view-builder';

const filters: TypedField[] = [
    {
        type: FieldType.Text,
        title: 'Название проекта',
        name: 'name',
    }
];

const columns: IListColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
];

const actions: IListAction[] = [
    {
        type: ActionType.Add,
        onClick(filterData) {
            console.log(filterData);
        },
    },
];

export const ListPage = () => {

    const handler = (filterData: any) => {
        console.log({filterData});
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

    return (
        <ListTyped
            heightRequest={heightRequest}
            actions={actions}
            filters={filters}
            columns={columns}
            handler={handler}
        />
    );  
};

export default ListPage;

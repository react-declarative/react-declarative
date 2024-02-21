# DataGrid software design to reduce app cost

> Link to [the original article](https://habr.com/en/articles/677070/)

Short time ago, I had the opportunity to participate in the development of an admin panel for a video game with a focus on collaborative competitions. Since the funding was provided through a grant, there was a limited budget.

There was a need to design the application architecture in such a way that, by writing templates for list forms and list item forms once, a Junior-level developer could easily generate them en masse. Additionally, after reaching self-sustainability, the existing code would need to be maintained without spending time and money on refactoring.

The admin panel is crucial as it facilitates Know Your Customer (KYC) processes and bans cheaters. However, for the business, it is not the main product, so there is a desire to save money.

## Market Analysis

Let's examine existing solutions on the market, namely DevExtreme React Grid, ReactVirtualized Grid, KendoReact Data Grid, MUI DataGridPro. All of them shift the responsibility for pagination, sorting, and filtering to the component or application state.

```tsx
import * as React from 'react';

// import ...

const defaultTheme = createTheme();
const useStylesAntDesign = makeStyles(
  (theme) => ({
    // CSS-in-JS
  }),
  { defaultTheme },
);

const useStyles = makeStyles(
  (theme) => ({
    // CSS-in-JS
  }),
  { defaultTheme },
);

function SettingsPanel(props) {
  const { onApply, type, size, theme } = props;
  const [sizeState, setSize] = React.useState(size);
  const [typeState, setType] = React.useState(type);
  const [selectedPaginationValue, setSelectedPaginationValue] = React.useState(-1);
  const [activeTheme, setActiveTheme] = React.useState(theme);

  const handleSizeChange = React.useCallback((event) => {
    setSize(Number(event.target.value));
  }, []);

  const handleDatasetChange = React.useCallback((event) => {
    setType(event.target.value);
  }, []);

  const handlePaginationChange = React.useCallback((event) => {
    setSelectedPaginationValue(event.target.value);
  }, []);

  const handleThemeChange = React.useCallback((event) => {
    setActiveTheme(event.target.value);
  }, []);

  const handleApplyChanges = React.useCallback(() => {
    onApply({
      size: sizeState,
      type: typeState,
      pagesize: selectedPaginationValue,
      theme: activeTheme,
    });
  }, [sizeState, typeState, selectedPaginationValue, activeTheme, onApply]);

  return (
    <FormGroup className="MuiFormGroup-options" row>
      <FormControl variant="standard">
        <InputLabel>Dataset</InputLabel>
        <Select value={typeState} onChange={handleDatasetChange}>
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Commodity">Commodity</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard">
        <InputLabel>Rows</InputLabel>
        <Select value={sizeState} onChange={handleSizeChange}>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
          <MenuItem value={10000}>{Number(10000).toLocaleString()}</MenuItem>
          <MenuItem value={100000}>{Number(100000).toLocaleString()}</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard">
        <InputLabel>Page Size</InputLabel>
        <Select value={selectedPaginationValue} onChange={handlePaginationChange}>
          <MenuItem value={-1}>off</MenuItem>
          <MenuItem value={0}>auto</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard">
        <InputLabel>Theme</InputLabel>
        <Select value={activeTheme} onChange={handleThemeChange}>
          <MenuItem value="default">Default Theme</MenuItem>
          <MenuItem value="ant">Ant Design</MenuItem>
        </Select>
      </FormControl>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={handleApplyChanges}
      >
        <KeyboardArrowRightIcon fontSize="small" /> Apply
      </Button>
    </FormGroup>
  );
}

SettingsPanel.propTypes = {
  onApply: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  theme: PropTypes.oneOf(['ant', 'default']).isRequired,
  type: PropTypes.oneOf(['Commodity', 'Employee']).isRequired,
};

export default function FullFeaturedDemo() {
  const classes = useStyles();
  const antDesignClasses = useStylesAntDesign();
  const [isAntDesign, setIsAntDesign] = React.useState(false);
  const [type, setType] = React.useState('Commodity');
  const [size, setSize] = React.useState(100);
  const { loading, data, setRowLength, loadNewData } = useDemoData({
    dataSet: type,
    rowLength: size,
    maxColumns: 40,
    editable: true,
  });

  const [pagination, setPagination] = React.useState({
    pagination: false,
    autoPageSize: false,
    pageSize: undefined,
  });

  const getActiveTheme = () => {
    return isAntDesign ? 'ant' : 'default';
  };

  const handleApplyClick = (settings) => {
    if (size !== settings.size) {
      setSize(settings.size);
    }

    if (type !== settings.type) {
      setType(settings.type);
    }

    if (getActiveTheme() !== settings.theme) {
      setIsAntDesign(!isAntDesign);
    }

    if (size !== settings.size || type !== settings.type) {
      setRowLength(settings.size);
      loadNewData();
    }

    const newPaginationSettings = {
      pagination: settings.pagesize !== -1,
      autoPageSize: settings.pagesize === 0,
      pageSize: settings.pagesize > 0 ? settings.pagesize : undefined,
    };

    setPagination((currentPaginationSettings) => {
      if (
        currentPaginationSettings.pagination === newPaginationSettings.pagination &&
        currentPaginationSettings.autoPageSize ===
          newPaginationSettings.autoPageSize &&
        currentPaginationSettings.pageSize === newPaginationSettings.pageSize
      ) {
        return currentPaginationSettings;
      }
      return newPaginationSettings;
    });
  };

  return (
    <div className={classes.root}>
      <SettingsPanel
        onApply={handleApplyClick}
        size={size}
        type={type}
        theme={getActiveTheme()}
      />
      <DataGridPro
        className={isAntDesign ? antDesignClasses.root : undefined}
        {...data}
        components={{
          Toolbar: GridToolbar,
        }}
        loading={loading}
        checkboxSelection
        disableSelectionOnClick
        {...pagination}
      />
    </div>
  );
}
```

You can see a complete code of DataGridPro [here](https://codesandbox.io/s/nasty-mui-datagridpro-sample-uchw3m). Such an approach inevitably leads to an increase in the cost of maintenance, as copy-pasting sorting, filtering, and pagination will burden the project with legacy code.

## Theses on the issues with the above code:

Since these are different useState instances, changing type, size, and pagination will trigger an intermediate rendering when the value of the first state changes, but the effect to update the second one has not occurred yet. What if, for a server request, we need to obtain the current values of all three states simultaneously (see the Apply button)?

The SettingsPanel component will be used in the application exactly once for filters on this page. It's debatable, but in my opinion, it's more of a function that returns JSX.Element rather than a component.

What if we want to implement pagination with filters and sorting on the backend? How do we show the user a loading indicator and block the application on a status-500 error, without resorting to copy-pasting?

## Solution to the problem:

Eliminate the copy-pasting of states and extract the data retrieval request into a clean function that takes filterData, limit, offset, etc., as input and returns either an array or a promise with an array of elements for the list form.

Create a configuration for filters to maintain a consistent style and eliminate the copy-pasting of the SettingsPanel component. Alternatively, pass the component through props, ensuring a pre-agreed contract.

Devise a higher-order function that, before executing the original data retrieval function (item 1), includes a loading indicator, turns it off in the finally block, and, if necessary, notifies the user of a status-500 error.

## Additional points:

Missing buttons for managing rows. For instance, what if we want to invite selected traders to a conference? Add a "Invitation Status" column to the table and create an "Invite" button. However, if the invitation has already been sent, the corresponding button for the trader should be disabled.

![datagridpro](../../assets/images/datagridpro.png)


Furthermore, it would be desirable to allow sending invitations to multiple traders based on the selected rows. The logic for disabling this button requires memoization of data when switching pages in the list.

Pure function for obtaining the list of items
To separate the business logic of the application programmer from the grid's system logic, I would recommend passing a pure function with the following prototype as a prop to the list form component:

```tsx
import { List } from 'react-declarative';

type RowId = string | number;

interface IRowData {
  id: RowId;
}

type HandlerPagination = {
  limit: number;
  offset: number;
};

type HandlerSortModel<RowData extends IRowData = any> = {
  field: keyof RowData;
  sort: 'asc' | 'desc';
}[];

type HandlerChips<RowData extends IRowData = any> = 
  Record<keyof RowData, boolean>;

type HandlerResult<RowData extends IRowData = IAnything> = {
  rows: RowData[];
  total: number | null;
};

type Handler<FilterData = any, RowData extends IRowData = any> = (
  filterData: FilterData,
  pagination: ListHandlerPagination,
  sort: ListHandlerSortModel<RowData>,
  chips: ListHandlerChips<RowData>,
  search: string,
) => Promise<HandlerResult<RowData>> | HandlerResult<RowData>;

const handler: Handler = (filterData, pagination, sort, chips, search) => {
	...
};

...

<List
  handler={handler}
  ...
/>
```

The `handler` function receives the following five parameters: 

1. `filterData` - the content of the SettingsPanel component, conceptually representing advanced filters, such as ComboBox, sliders, etc. 
2. `pagination` - an object with two properties: `limit` and `offset`. These properties are sent to the backend for pagination and allow the following operation: `rows.slice(offset, limit + offset)`. 
3. `sort` - an array with column sorting information. Sorting can be either `asc` (ascending) or `desc` (descending). 
4. `chips` - an object with boolean flags for filtering the list. For example, among the list of employees, we might want to select only those who are registered as self-employed. 
5. `search` - a string for global search. We attempt to parse the user's native language for search, similar to how Google does it.

The `handler` function can be constructed through a `Factory`, which can then be placed in a hook:

```tsx
import mock from './person_list.json';

...

const handler = useArrayPaginator(mock);
```

The `useArrayPaginator` hook will have the following implementation, allowing dynamic changes to the processing of each of the five arguments in the handler. By the way, you can also pass a promise as input, which will return an array of elements without sorting, pagination, etc.

```tsx
import ...

const EMPTY_RESPONSE = {
    rows: [],
    total: null,
};

type ArrayPaginatorHandler<FilterData = any, RowData extends IRowData = any> =
  RowData[] | ((
    data: FilterData,
    pagination: ListHandlerPagination,
    sort: ListHandlerSortModel<RowData>,
    chips: ListHandlerChips<RowData>,
    search: string,
  ) => Promise<ListHandlerResult<RowData>> | ListHandlerResult<RowData>);

export interface IArrayPaginatorParams<
  FilterData = any,
  RowData extends IRowData = any
> {
    filterHandler?: (rows: RowData[], filterData: FilterData) => RowData[];
    chipsHandler?: (rows: RowData[], chips: HandlerChips<RowData>) => RowData[];
    sortHandler?: (rows: RowData[], sort: HandlerSortModel<RowData>) => RowData[];
    paginationHandler?: (rows: RowData[], pagination: HandlerPagination) => RowData[];
    searchHandler?: (rows: RowData[], search: string) => RowData[];
    withPagination?: boolean;
    withFilters?: boolean;
    withChips?: boolean;
    withSort?: boolean;
    withTotal?: boolean;
    withSearch?: boolean;
    onError?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
}

export const useArrayPaginator = <
  FilterData = any,
  RowData extends IRowData = any
>(
  rowsHandler: ArrayPaginatorHandler<FilterData, RowData>, {
    filterHandler = (rows, filterData) => {
        Object.entries(filterData).forEach(([key, value]) => {
            if (value) {
                const templateValue = String(value).toLocaleLowerCase();
                rows = rows.filter((row) => {
                    const rowValue = String(row[key as keyof RowData])
                      .toLowerCase();
                    return rowValue.includes(templateValue);
                });
            }
        });
        return rows;
    },
    chipsHandler = (rows, chips) => {
        if (!Object.values(chips).reduce((acm, cur) => acm || cur, false)) {
            return rows;
        }
        const tmp: RowData[][] = [];
        Object.entries(chips).forEach(([chip, enabled]) => {
            if (enabled) {
                tmp.push(rows.filter((row) => row[chip]));
            }
        });
        return tmp.flat();
    },
    sortHandler = (rows, sort) => {
        sort.forEach(({
            field,
            sort,
        }) => {
            rows = rows.sort((a, b) => {
                if (sort === 'asc') {
                    return compareFn(a[field], b[field]);
                } else if (sort === 'desc') {
                    return compareFn(b[field], a[field]);
                }
            });
        });
        return rows;
    },
    searchHandler = (rows, search) => {
        if (rows.length > 0 && search) {
            return rows.filter((row) => {
                return String(row["title"]).toLowerCase()
                  .includes(search.toLowerCase());
            });
        } else {
            return rows;
        }
    },
    paginationHandler = (rows, {
        limit,
        offset,
    }) => {
        if (rows.length > limit) {
            return rows.slice(offset, limit + offset);
        } else {
            return rows;
        }
    },
    withPagination = true,
    withFilters = true,
    withChips = true,
    withSort = true,
    withTotal = true,
    withSearch = true,
    onError,
    onLoadStart,
    onLoadEnd,
}: IArrayPaginatorParams<FilterData, RowData> = {}) => {

    const resolveRows = useMemo(() => async (
        filterData: FilterData,
        pagination: ListHandlerPagination,
        sort: ListHandlerSortModel,
        chips: ListHandlerChips,
        search: string,
    ) => {
        if (typeof rowsHandler === 'function') {
            return await rowsHandler(
              filterData,
              pagination,
              sort,
              chips,
              search
            );
        } else {
            return rowsHandler;
        }
    }, []);

    const handler: Handler<FilterData, RowData> = useMemo(() =>
        async (filterData, pagination, sort, chips, search) => {
          let isOk = true;
          try {
              onLoadStart && onLoadStart();
              const data = await resolveRows(
                filterData,
                pagination,
                sort,
                chips,
                search
              );
              let rows = Array.isArray(data) ? data : data.rows;
              if (withFilters) {
                  rows = filterHandler(rows.slice(0), filterData);
              }
              if (withChips) {
                rows = chipsHandler(rows.slice(0), chips);
              }
              if (withSort) {
                  rows = sortHandler(rows.slice(0), sort);
              }
              if (withSearch) {
                  rows = searchHandler(rows.slice(0), search);
              }
              if (withPagination) {
                  rows = paginationHandler(rows.slice(0), pagination);
              }
              const total = Array.isArray(data)
                ? data.length
                : (data.total || null);
              return {
                  rows,
                  total: withTotal ? total : null,
              };
          } catch (e) {
              isOk = false;
              if (onError) {
                  onError(e as Error);
                  return { ...EMPTY_RESPONSE };
              } else {
                  throw e;
              }
          } finally {
              onLoadEnd && onLoadEnd(isOk);
          }
    }, []);

    return handler;
};

export default useArrayPaginator;
```

We can encapsulate the useArrayPaginator hook within our own custom hook that intercepts callbacks such as onLoadStart, onLoadEnd, and onError, displaying a loading animation to the user. Similarly, it's easy to write a useApiPaginator that constructs a request to a json:api.

## Declaration of Columns

To display columns, a configuration must be created. If necessary, multiple display engines can be written, with/without virtualization, infinite scrolling or pagination, a mobile version, and so on.

```tsx
import { IColumn, List } from 'react-declatative';

const columns: IColumn<IPerson>[] = [
  {
    type: ColumnType.Component,
    headerName: 'Avatar',
    width: () => 65,
    phoneOrder: 1,
    minHeight: 60,
    element: ({ avatar }) => (
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={avatar}
          alt={avatar}
        />
      </Box>
    ),
  },
  {
    type: ColumnType.Compute,
    primary: true,
    field: 'name',
    headerName: 'Name',
    width: (fullWidth) => Math.max(fullWidth * 0.1, 135),
    compute: ({ firstName, lastName }) => `${firstName} ${lastName}`,  
  },
  ...
  {
    type: ColumnType.Action,
    headerName: 'Actions',
    width: () => 50,
  },
];

...

return (
  <List
    handler={handler}
    ...
    columns={columns}
  />
);
```

It is noteworthy that such an interface not only allows setting the column width to adjust the row height or enable horizontal scrolling but also facilitates the creation of a full-fledged mobile version for the list form. For each row, you can optionally specify a three-dot menu. This menu can contain a link to the list item form or generate a report for a single item.

```tsx
import { IListRowAction, List } from 'react-declatative';

const rowActions: IListRowAction<IPerson>[] = [
  {
    label: 'Export to excel',
    action: 'excel-export',
    isVisible: (person) => person.features.includes('excel-export'),
  },
  {
    label: 'Remove draft',
    action: 'remove-draft',
    isDisabled: (person) => !person.features.includes('remove-draft'),
    icon: Delete,
  },
];

return (
  <List
    handler={handler}
    columns={columns}
    ...
    rowActions={rowActions}
  />
);
```

The three-dot menu items for a list form row can be disabled using the `isDisabled` callback and hidden using the `isVisible` callback. Both callbacks receive the row element as input and return a boolean or a Promise<boolean>...

## Actions on Multiple Rows

Operations that are used infrequently can be moved to a global "three-dot" menu in the FAB (Floating Action Button) in the top right corner of the form. There, you can include options like exporting selected items to Excel or a button to refresh the page's content.

```tsx
import { IListAction, List } from 'react-declarative';

const actions: IListAction<IPerson>[] = [
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
        action: 'update-now',
      },
      {
        action: 'resort-action',
      },
      {
        action: 'excel-export',
        label: 'Export to excel',
        isDisabled: async (rows) => {
          return rows.every(({ features }) =>
            features.includes('excel-export')
          );
        },
      },
      {
        action: 'disabled-action',
        isDisabled: async (rows) => {
          await sleep(5_000)
          return true
        },
        label: 'Disabled',
      },
      {
        action: 'hidden-action',
        isVisible: (rows) => false,
        label: 'Hidden',
      },
    ],
  }
];

return (
  <List
    handler={handler}
    columns={columns}
    rowActions={rowActions}
    ...
    actions={actions}
  />
);
```

## User Input Handling

After selecting an item from the context menu or clicking the operation button, the following callbacks are triggered:

```tsx
import { List } from 'react-declarative';

...

const handleAction = (action: string, rows: IPerson) => {
  if (action === 'excel-export') {
    ...
  } else if (...) {
    ...
};

const handleRowAction = (action: string, row: IPerson) => {
  if (action === 'excel-export') {
    ...
  } else if (...) {
    ...
};

return (
  <List
    handler={handler}
    columns={columns}
    rowActions={rowActions}
    actions={actions}
    ...
    onAction={handleAction}
    onRowAction={handleRowAction}
  />
);
```

# Data Filtering

In addition to the global search (visible when filters are hidden), you can expand the filters and specify multiple parameters. It can be rendered either via a JSON template or through a slot – passing a component with a pre-declared interface of props through context.

```tsx
import { IField, List } from 'react-declarative';

const filters: IField[] = [
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

return (
  <List
    handler={handler}
    columns={columns}
    rowActions={rowActions}
    actions={actions}
    operations={operations}
    ...
    onAction={handleAction}
    onRowAction={handleRowAction}
    onOperation={handleOperation}
    ...
    filters={filters}
  />
);
```

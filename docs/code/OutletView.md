# OutletView

Outlet is a pattern [inspired from react-router-dom](https://reactrouter.com/en/main/components/outlet). In compasion with react-router, the `<OutletView/>` manage form submit state from multiple pages, prevent page leave when data changed. Let's break down the example code

```tsx
const DEFAULT_PATH = "/employee/employee";

const history = createMemoryHistory();

export const useEmployeeEditModal = () => {
  const { push, pop } = useModalManager();

  const { pickData, render } = useOutletModal({
    history,
    withActionButton: true,
    withStaticAction: true,
    animation: "none",
    title: "Employee",
    routes,
    AfterTitle: ({ onClose }) => (
      <IconButton size="small" onClick={onClose}>
        <Close />
      </IconButton>
    ),
    fetchState: async (id) => [
      await ioc.employeeViewService.read(id),
      await ioc.permissionService.getFeatures(),
      await ioc.permissionService.getVisibility(),
    ],
    mapInitialData: (_, [employee]) => ({
      employee,
    }),
    mapPayload: (id, [, features, visibility]) => ({
      id,
      features,
      visibility,
    }),
    onLoadStart: () => ioc.layoutService.setAppbarLoader(true),
    onLoadEnd: () => ioc.layoutService.setAppbarLoader(false),
    onSubmit: (id, data) => {
      if (data) {
        await fetchApi('/api/v1/employee', {
            method: "POST",
            data: JSON.stringify(data.employee),
        });
        ioc.routerService.push(`/employee/${id}`);
      }
      return true;
    },
    onClose: () => {
      pop();
    },
    submitLabel: "Open",
  });

  return (id: string) => {
    push({
      id: "employee",
      render,
      onInit: () => {
        history.push(DEFAULT_PATH);
      },
      onMount: () => {
        pickData(id);
      },
    });
  };
};

export default useEmployeeEditModal;
```

- This code defines a custom hook named `useEmployeeEditModal` which is used to manage a modal for previewing employee details. Here's a breakdown of what the code does: 

1. It sets up a default path (`DEFAULT_PATH`) and a memory history using `createMemoryHistory()` from a library `history`. 

2. The `useEmployeeEditModal` hook utilizes other custom hooks like `useModalManager` and `useOutletModal` to manage the modal behavior and rendering. 

3. The `useOutletModal` hook is configured with various options:

- It sets up modal properties such as title, pathname, action buttons, animation, etc. 
- It fetches data asynchronously using `fetchState`, combining multiple promises using `Promise.all`.
- It maps the fetched data to a format expected by the modal.
- It handles submission of data.
- It defines behavior on load start and end.
- It provides a callback for when the modal is closed. 

4. Inside the `useEmployeeEditModal` hook, there's a function that returns another function. This inner function takes an `id` parameter. When invoked, it pushes a new modal instance onto the modal stack. This modal instance includes properties like `id`, `render` (the modal content), and lifecycle methods (`onInit` and `onMount`).

5. When the modal is initialized (`onInit`), it pushes the default path (`DEFAULT_PATH`) to the history, ensuring that the modal is displayed at the correct location. 

6. When the modal is mounted (`onMount`), it calls `pickData` with the provided `id`, presumably to fetch and prepare data related to the employee being previewed. 

7. Finally, the `useEmployeeEditModal` hook returns the function that triggers the modal opening when called with an `id`.

Overall, this code encapsulates the logic for managing a modal editing employee details and allows for easy integration into a React application using custom hooks.

```tsx
const hasMatch = (templates: string[], pathname: string) => {
  return templates.some((template) => template.includes(pathname));
};

export const getCurrentId = (
  history: MemoryHistory | BrowserHistory | HashHistory
) => {
  return (
    routes.find(({ isActive }) => isActive(history.location.pathname))?.id ||
    "object"
  );
};

export const routes: IOutlet[] = [
  {
    id: "employee",
    element: DataView,
    isActive: (pathname) => hasMatch(["/employee/employee"], pathname),
  },
  {
    id: "history",
    element: HistoryView,
    isActive: (pathname) => {
      console.log(pathname);
      return hasMatch(["/employee/history"], pathname);
    },
  },
];

export default routes;
```

Nested views in outlet are placed to routes. This simplify active view management if we working with tabs or wizard steps. Also the `<OutletView />` use `history.replace` for navigation to easy integrate to the upper `<Switch />` router. Oulet can be shown directly on a page or opened in modal with `useOutletModal`, `useTabsModal`, `useWizardModal` hooks

```tsx
export const DataView = ({ history, payload, data, formState, beginSave }: IOutletProps) => (
    <Container>
        <Breadcrumbs2
          payload={formState}
          items={options}
          onAction={async (action) => {
            if (action === "save-action") {
                await beginSave();
            }
          }}
        />
        <SideBar history={history} payload={payload}>
            <One
                fields={employee_fields}
                handler={() => data}
                payload={payload}
            />
        </SideBar>
    </Container>
);

export default DataView;
```

The `hasChanged`, `hasLoading`, `hasInvalid` flags can be taken from `formState` object. They will help you synchronise form state while switching multiple views without data loss

```tsx
const options: IBreadcrumbs2Option[] = [
  {
    type: Breadcrumbs2Type.Button,
    isDisabled: ({ hasChanged }) => !hasChanged,
    action: "save-action",
    label: "Submit",
  },
];
```

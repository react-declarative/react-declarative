# Export

The `react-declarative` library serve as a central export hub for the project, organizing and exposing various functionalities and components for reuse across the application. The [src/index.ts](/src/index.ts) file exports various modules, types, functions, and constants. Here's a summary of what's being exported:

### Types and Interfaces 

1. **Type Aliases** : 
- `IListApiPaginatorParams` 
- `ILastArrayPaginatorParams` 
- `IOneApiHandlerParams`
- Several others for internal types. 

2. **Re-exported Types** : 
- `FieldType` 
- `ColumnType` 
- `ActionType` 
- `SelectionMode`
- Several others related to model and list operations. 

3. **Types for UI Components** : 
- Various types related to UI components like `IScaffoldOption`, `IBreadcrumbsOption`, `ITile`, `TGridSort`, etc. 

4. **Slots for UI Components** :
- Slots for different UI components such as checkboxes, radios, text, files, etc. 

5. **Props and Slots for Outlet Views** :
- Types related to outlet views and their props. 

6. **Props and Slots for Wizard and Tabs** :
- Types related to wizard and tabs components along with their props and slots. 

7. **Miscellaneous Types** : 
- `History` type
- Various utility types and interfaces.

### Functions 

1. **Utility Functions** :
- Utility functions for common tasks like fetching, handling errors, manipulating arrays and objects, etc. 

2. **Hook Functions** :
- Hooks for various functionalities like async operations, managing states, handling media, etc. 

3. **Component Slots** :
- Slots for different UI components like checkboxes, radios, text, files, etc. 

4. **Routing and Navigation** :
- Functions related to routing and navigation such as getting route parameters, route items, etc. 

5. **State Providers** :
- Functions for creating state providers for different contexts. 

6. **Higher-order Functions (HOFs)** :
- Higher-order functions for various purposes like debouncing, retrying, queuing tasks, etc. 

7. **Miscellaneous Functions** :
- Functions for tasks like downloading files, copying to clipboard, choosing files, etc.

### Constants 

1. **Default Views** : 
- Default views like `AlertView`, `LoaderView`, `ErrorView`, etc. 

2. **Feature Views** :
- Views related to features like calendars, infinite scrolling, search, etc. 

3. **UI Components** : 
- Components like `ModalProvider`, `SizeProvider`, `SnackProvider`, etc. 

4. **Others** : 
- Various constants like `VIRTUAL_VIEW_ROOT`, `MASTER_DETAIL_HEADER`, etc.

### Third-party Libraries 

1. **Day.js** : 
- Re-exported `dayjs` library.

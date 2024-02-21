# Onion architecture or OOP in a modern React / Mobx application

> Link to [original article](https://habr.com/en/articles/669696/)

Coding UI components is easier in a functional style. React stands out in this regard, especially after the introduction of hooks, making component code significantly more readable and convenient for modernization. Moreover, creating custom components in a better way is highly time-consuming and challenging in terms of finding skilled personnel. It makes sense to talk about combining the decomposition of the application state in an object-oriented programming (OOP) style and modern practices for building web application views (FP).

# The problem of outdated JavaScript frameworks

The problem of Backbone, Marionette, and others is that they smear the presentation layer thinly across class methods and are extremely difficult for static type checking. As a result, the Model was often skipped entirely, the View was implemented questionably due to the complexities of adopting a component-based approach, and the Controller was made too intricate through classes built into the standard library that don't always align with business requirements.

However, leaving the View in a functional style using ready-made components, writing the Model in TypeScript, and implementing business logic in OOP with dependency injection can save money by applying tried-and-true practices known to the most budget-friendly hires in the market—students.

## Dependency Injection

To organize a multi-layered architecture, it is necessary to separate application services into base and business logic services. The cleanest code for doing this is through dependency injection. For example, you can use InversifyJS:

```tsx
import { injectable, inject } from "inversify";
import { makeObservable } from "mobx";
import { action, observable } from "mobx";

import ApiService from "../../base/ApiService";
import RouterService from "../../base/RouterService";

import TYPES from "../../types";

@injectable()
export class SettingsPageService {

  @observable
  @inject(TYPES.apiService)
  readonly apiService!: ApiService;

  @observable
  @inject(TYPES.routerService)
  readonly routerService!: RouterService;

  constructor() {
  makeObservable(this);
  };

  // ...
}
```


However, since decorators are not standardized in JavaScript, and the syntax is complex, I would recommend writing your own Dependency Service and using it for injecting services through functions.

```tsx
// src/helpers/serviceManager.ts

export const serviceManager = new class {

  _creators = new Map<string | Symbol, () => unknown>();
  _instances = new Map<string | Symbol, unknown>();

  registerInstance = <T = unknown>(key: string, inst: T) => {
  this._instances.set(key, inst);
  };

  registerCreator = <T = unknown>(key: string | Symbol, ctor: () => T) => {
  this._creators.set(key, ctor);
  };

  inject = <T = unknown>(key: string | symbol): T => {
  if this._creators.has(key)) {
    const instance = this._creators.get(key)!();
    this._instances.set(key, instance);
    return instance as T;
  } else {
    console.warn('serviceManager unknown service', key);
    return null as never;
  }
  };

  clear = () => {
  this._creators.clear();
  this._instances.clear();
  };

};

const { registerCreator: provide, inject } = serviceManager;
export { provide, inject };

export default serviceManager;
```

The `serviceManager.ts` file exports functions `provide` and `inject`, allowing you to register a service and perform dependency injection. Afterward, building a layered architecture should pose no significant difficulty.

```html
src
  │   config.ts
  │   ioc.ts
  │   types.ts
  │
  └───lib
    ├───base
    │   ApiService.ts
    │   ErrorService.ts
    │   RouterService.ts
    │   SessionService.ts
    │
    └───view
    │   PersonService.ts
```

We should create basic services; I'll provide examples of some. They should be placed in the src/lib/base folder. 

1. **ApiService** : A wrapper for HTTP requests to the server, handling sessions and errors.

```tsx
// src/lib/base/ApiService.ts

import { makeAutoObservable } from "mobx";
import { inject } from "../../helpers/serviceManager";

import SessionService from "./SessionService";
import ErrorService, { OfflineError } from "./ErrorService";

import { API_ORIGIN, API_TOKEN } from "../../config";

import TYPES from "../types";

type JSON = Record<string, unknown>;

export class ApiService {

  readonly sessionService = inject<SessionService>(TYPES.sessionService);
  readonly errorService = inject<ErrorService>(TYPES.errorService);

  constructor() {
    makeAutoObservable(this);
  };

  private handleSearchParams = <D = JSON>(url: URL, params?: D) => {
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object') {
          url.searchParams.set(key, JSON.stringify(value));
        } else if (typeof value === 'number') {
          url.searchParams.set(key, value.toString());
        } else if (typeof value === 'string') {
          url.searchParams.set(key, value.toString());
        } else {
          throw new Error(`Unknown param type ${key}`);
        }
      }
    }
  };
  
  private handleJSON = <T = JSON>(data: string): T => {
    try {
      return JSON.parse(data) as T;
    } catch {
      return {} as T;
    }
  };
  
  private request = <T = JSON, D = JSON>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: URL,
    data?: D,
  ) => new Promise<T>(async (res, rej) => {
    try {
      const request = await fetch(url.toString(), {
        method,
        headers: {
          ...(this.sessionService.sessionId && ({
            [API_TOKEN]: this.sessionService.sessionId,
          })),
          'Content-type': 'application/json',
        },
        ...(data && {
          body: JSON.stringify(data),
        }),
      });
      const text = await request.text();
      const json = this.handleJSON<T>(text);
      this.errorService.processStatusCode(request.status);
      if ('error' in json) {
        rej(json);
      } else {
        res(json);
      }
    } catch (e) {
      if (!window.navigator.onLine) {
        e = new OfflineError();
      }
      this.errorService.handleError(e as Error);
      rej(e);
    }
  });

  public get = <T = JSON, D = JSON>(url: URL | string, data?: D): Promise<T> => {
    const targetUrl = typeof url === 'string' ? new URL(url, API_ORIGIN) : url;
    this.handleSearchParams<D>(targetUrl, data);
    return this.request<T>('GET', targetUrl);
  };


  public remove = <T = JSON, D = JSON>(url: URL | string, data?: D): Promise<T> => {
    const targetUrl = typeof url === 'string' ? new URL(url, API_ORIGIN) : url;
    this.handleSearchParams<D>(targetUrl, data);
    return this.request<T, D>('DELETE', targetUrl);
  };


  public post = <T = JSON, D = JSON>(url: URL | string, data?: D): Promise<T> => {
    if (typeof url === 'string') {
      return this.request<T, D>('POST', new URL(url, API_ORIGIN), data);
    }
    return this.request<T, D>('POST', url, data);
  };

  
  public put = <T = JSON, D = JSON>(url: URL | string, data?: D): Promise<T> => {
    if (typeof url === 'string') {
      return this.request<T, D>('PUT', new URL(url, API_ORIGIN), data);
    }
    return this.request<T, D>('PUT', url, data);
  };

 
  public patch = <T = JSON, D = JSON>(url: URL | string, data?: D): Promise<T> => {
    if (typeof url === 'string') {
      return this.request<T, D>('PATCH', new URL(url, API_ORIGIN), data);
    }
    return this.request<T, D>('PATCH', url, data);
  };

};

export default ApiService;
```

 
2. **ErrorService** : A service for handling exceptions.

```tsx
// src/lib/base/ErrorService.ts

import { makeAutoObservable } from "mobx";

import { Subject } from "rxjs";

class BaseError { }

const createError = (type: string): typeof BaseError =>
    class extends BaseError {
        type = ''
        constructor() {
            super();
            this.type = type;
        }
    };

export const UnauthorizedError = createError('unauthorized-error');
export const ForbiddenError = createError('forbidden-error');
export const InternalError = createError('internal-error');
export const OfflineError = createError('offline-error');

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const INTERNAL = 500;
const GATEWAY = 504;


export class ErrorService {

    permissionsSubject = new Subject<void>();
    offlineSubject = new Subject<void>();
    dieSubject = new Subject<void>();

    constructor() {
        makeAutoObservable(this);
    };

    processStatusCode = (code: number) => {
        if (code === UNAUTHORIZED) {
            throw new UnauthorizedError();
        } else if (code === FORBIDDEN) {
            throw new ForbiddenError();
        } else if (code === INTERNAL) {
            throw new InternalError();
        } else if (code === GATEWAY) {
            throw new InternalError();
        }
    };

    handleError = (e: Error) => {
        console.log('errorService handleError', e);
        if (e instanceof ForbiddenError) {
            this.logout();
        } else if (e instanceof InternalError) {
            this.die();
        } else if (e instanceof UnauthorizedError) {
            this.logout();
        } else if (e instanceof OfflineError) {
            this.offline();
        } else {
            this.die();
        }
    };

    die = () => {
        this.dieSubject.next();
    };

    offline = () => {
        this.offlineSubject.next();
    };

    logout = async () => {
        this.permissionsSubject.next();
    };

};

export default ErrorService;
```

 
3. **RouterService** : A service for navigating through application pages.

```tsx
// src/lib/base/RouterService.ts

import { makeAutoObservable } from "mobx";

import { 
  Action,
  Blocker,
  BrowserHistory,
  Listener,
  Location,
  State,
  To,
  createMemoryHistory
} from "history";

const browserHistory = createMemoryHistory();

export class RouterService implements BrowserHistory {

  previousPath = '/';

  location: Location = browserHistory.location;
  action: Action = browserHistory.action;

  constructor() {
    makeAutoObservable(this)
  }

  updateState() {
    const { location, action } = browserHistory;
    this.previousPath = this.location?.pathname || '/';
    this.location = location;
    this.action = action;
  }

  createHref(to: To) {
    const result = browserHistory.createHref(to);
    this.updateState();
    return result;
  }

  push(to: To, state?: State) {
    const result = browserHistory.push(to, state);
    this.updateState();
    return result;
  }

  replace(to: To, state?: State) {
    const result = browserHistory.replace(to, state);
    this.updateState();
    return result;
  }

  go(delta: number) {
    const result = browserHistory.go(delta);
    this.updateState();
    return result;
  }

  back() {
    const result = browserHistory.back();
    this.updateState();
    return result;
  }

  forward() {
    const result = browserHistory.forward();
    this.updateState();
    return result;
  }

  listen(listener: Listener) {
    const result = browserHistory.listen(listener);
    this.updateState();
    return result;
  }

  block(blocker: Blocker) {
    const result = browserHistory.block(blocker);
    this.updateState();
    return result;
  }
};

export default RouterService;
```

## Joining together

To connect these services, you'll need three files: `types.ts`, `config.ts`, and `ioc.ts`. There's a code

```tsx
// src/lib/types.ts

const baseServices = {
    routerService: Symbol.for('routerService'),
    sessionService: Symbol.for('sessionService'),
    errorService: Symbol.for('errorService'),
    apiService: Symbol.for('apiService'),
};

const viewServices = {
    personService: Symbol.for('personService'),
};

export const TYPES = {
    ...baseServices,
    ...viewServices,
};

export default TYPES;
```

The file `config.ts` has no exports and is executed once in `ioc.ts` to map factories with string aliases for services.

```tsx
// src/lib/config.ts

import { provide } from '../helpers/serviceManager'

import RouterService from "./base/RouterService";
import SessionService from "./base/SessionService";
import ErrorService from "./base/ErrorService";
import ApiService from "./base/ApiService";

import MockService from './view/PersonService';

import TYPES from "./types";

provide(TYPES.routerService, () => new RouterService());
provide(TYPES.sessionService, () => new SessionService());
provide(TYPES.errorService, () => new ErrorService());
provide(TYPES.apiService, () => new ApiService());

provide(TYPES.personService, () => new PersonService());
```

The `ioc.ts` file joins interdependent services through events to prevent cyclic dependencies. This mechanism is required if you want to write an `AuthService` (in this case, a wrapper over the auth0.com client), as it will depend on `SessionService`, and `SessionService` on `AuthService`.

```tsx
// src/lib/ioc.ts

import { inject } from '../helpers/serviceManager';

import RouterService from "./base/RouterService";
import SessionService from "./base/SessionService";
import ErrorService from "./base/ErrorService";
import ApiService from "./base/ApiService";

import PersonService from './view/PersonService';

import { DENIED_PAGE } from "../config";
import { ERROR_PAGE } from "../config";
import { OFFLINE_PAGE } from "../config";

import "./config"

import TYPES from "./types";

const systemServices = {
    routerService: inject<RouterService>(TYPES.routerService),
    sessionService: inject<SessionService>(TYPES.sessionService),
    errorService: inject<ErrorService>(TYPES.errorService),
    apiService: inject<ApiService>(TYPES.apiService),
};

const appServices = {
    personService: inject<PersonService>(TYPES.personService),
};

export const ioc = {
    ...systemServices,
    ...appServices,
};

ioc.errorService.permissionsSubject.subscribe(() => {
    ioc.routerService.push(DENIED_PAGE);
});

ioc.errorService.offlineSubject.subscribe(() => {
    ioc.routerService.push(OFFLINE_PAGE);
});

ioc.errorService.dieSubject.subscribe(() => {
    ioc.routerService.push(ERROR_PAGE);
});

ioc.errorService.permissionsSubject.subscribe(() => {
    ioc.sessionService.setSessionId("", true);
});

window.addEventListener('unhandledrejection', () => ioc.errorService.die());
window.addEventListener('error', () => ioc.errorService.die());

(window as any).ioc = ioc;

export default ioc;
```

The singleton `ioc` includes TypeScript typing, allowing for static type checking throughout the application. Additionally, `ioc` is duplicated in the global `window` object, enabling external developers to write extensions for the application without access to the source code.

## View Services Layer

Now let's consider the first service with business logic. As an academic example, this will be the `PersonService`, a service responsible for displaying a list of users with CRUD capabilities, including the ability to modify a list item.

```tsx
// src/lib/view/PersonService.ts

import { makeAutoObservable } from "mobx";

import {
  ListHandlerPagination,
  ListHandlerSortModel,
} from "../../model";

import IPerson from "../../model/IPerson";

import ApiService from "../base/ApiService";
import RouterService from "../base/RouterService";

import TYPES from "../types";

export class PersonService {
  
  readonly routerService = inject<RouterService>(TYPES.routerService);
  readonly apiService = inject<ApiService>(TYPES.apiService);

  constructor() {
    makeAutoObservable(this);
  }

  async list(
    filters: Record<string, unknown>,
    pagination: ListHandlerPagination,
    sort: ListHandlerSortModel
  ) {  
    let rows = await this.apiService.get<IPerson[]>(`crud`, {
      filters,
      sort,
    });
    const { length: total } = rows;
    rows = rows.slice(
      pagination.offset,
      pagination.limit + pagination.offset
    );
    return {
      rows,
      total,
    };
  };

  one(id: string): Promise<IPerson | null> {
    if (id === 'create') {
      return Promise.resolve(null);
    } else {
      return this.apiService.get<IPerson>(`persons/${id}`);
    }
  };

  save(person: IPerson) {
    return this.apiService.put(`crud/${person.id}`, person);
  }

  async create(rawPerson: IPerson) {
    const person = this.apiService.post<IPerson>(`crud`, rawPerson);
    this.routerService.push(`/persons/${person.id}`);
    return person;
  }

  remove(person: IPerson) {
    return this.apiService.remove(`crud/${person.id}`);
  };

};

export default PersonService;
```

The `list` method enables pagination from the user interface. The `save` method saves a newly created user without an ID and redirects the UI to a new page for subsequent changes. The `one` method loads user data based on the ID.

If an error occurs during data loading, the `ApiService` will contact the `ErrorService`, and the application will handle it successfully. In my project, a safe falling and restarting strategy is used in such cases.

The view service is not as complex as the base service, and by using copy-paste, beginners can transfer routine tasks.

## Why You Should Consider a Templating Engine

Ideally, it's better to exclude pagination and input validation from the service with business logic. In my opinion, this code should reside on the component side. This is where a form templating engine with configurations will come in handy.

```tsx
// src/pages/PersonList.tsx

import { useRef } from 'react';

import {
  List,
  FieldType,
  IColumn,
  IListApi,
  ColumnType,
} from '../components/ListEngine';

import {
  IField,
} from '../components/OneEngine';

import IPerson from '../model/IPerson';

import ioc from '../lib/ioc';

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

export const PersonList = () => {

  const apiRef = useRef<IListApi>(null);

  const handleRemove = async (person: IPerson) => {
    await ioc.personService.remove(person);
    await apiRef.current?.reload();
  };

  const handleClick = (person: IPerson) => {
    ioc.routerService.push(`/persons/${person.id}`);
  };

  const handleCreate = () => {
    ioc.routerService.push(`/persons/create`);
  };

  return (
    <List
      ref={apiRef}
      filters={filters}
      columns={columns}
      handler={ioc.personService.list}
      onCreate={handleCreate}
      onRemove={handleRemove}
      onClick={handleClick}
    />
  );
};

export default PersonList;
```

Data for the list form and list item form is loaded through the `handler` prop of the templating engine and the `list` and `one` methods. This ensures seamless integration of business logic into user interface components. On the plus side, this approach significantly reduces the amount of copy-pasting and maintains a consistent application style.

```tsx
// src/pages/PersonOne.tsx

import { useState } from 'react';

import {
  One,
  IField,
  Breadcrumbs,
  FieldType,
} from '../components/OneEngine';

import IPerson from '../model/IPerson';

import ioc from '../lib/ioc';

const fields: IField[] = [
  {
    name: 'firstName',
    type: FieldType.Text,
    title: 'First name',
    description: 'Required',
  },
  {
    name: 'lastName',
    type: FieldType.Text,
    title: 'Last name',
    description: 'Required',
  },
];

interface IPersonOneProps {
  id: string;
}

export const PersonOne = ({
  id,
}: IPersonOneProps) => {

  const [data, setData] = useState<IPerson | null>(null);

  const handleSave = async () => {
    if (id === 'create') {
      await ioc.personService.create(data);
    } else {
      await ioc.personService.save(data);
    }
  };

  const handleChange = (data: IPerson) => {
    setData(data);
  };

  return (
    <>
      <Breadcrumbs
        disabled={!data}
        onSave={handleSave}
      />
      <One
        fields={fields}
        handler={() => ioc.personService.one(id)}
        change={handleChange}
      />
    </>
  );
};

export default PersonOne;
```

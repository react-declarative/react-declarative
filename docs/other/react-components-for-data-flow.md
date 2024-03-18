# Gentleman's Set of React Components for FullStack Developers to Manage Data Flow

> Link to [the original article](https://habr.com/en/articles/676612/)

Often, due to the extensive workload, fullstack programming in React turns into haphazard coding with questionable quality. Code is copied without creating components, without global application state.

In this article, I will provide examples of using several components that allow deploying a feature to a test environment with minimal effort. This ensures that the code fetching data from the server is easily refactorable in the near future.

The ideal UI state for FullStack is a stateless state
Since the frontend state duplicates data structures declared on the backend, the likely cause of poor code is the desire to save on their frontend descriptions. As an alternative, I dare to suggest reviving the use of a stateless approach to simplify the codebase of React applications.

## `createProvider` Function 

> Allows placing any object into the React context. Along with Mobx, it can be used to create a shared controller for nested views. The anonymous class methods `getPosts` and `getPostById` use the `fetchApi` function, an alias for `fetch(...).then((data) => data.json())`.

```tsx
import { createProvider, fetchApi } from 'react-declarative';

const [BlogApiProvider, useBlogApi] = createProvider(
  () => new class {

    getPosts = () =>
      fetchApi("https://jsonplaceholder.typicode.com/posts")

    getPostById = (id) =>
      fetchApi(`https://jsonplaceholder.typicode.com/posts/${id}`)

  }
);

export { BlogApiProvider, useBlogApi };
```

## `<FetchView />` Component

> Suitable for loading data and displaying list forms without pagination. It supports loading data from multiple endpoints, and the list is specified by the `state` prop. After data loading, a list animation occurs.

```tsx
import { FetchView } from 'react-declarative'

const PostList = () => {

  const { getPosts } = useBlogApi();

  const state = [
    getPosts,
  ];

  return (
    <FetchView state={state} animation="fadeIn">
      {(posts) => (
        <div>
          {posts.map((post, idx) => (
            <p key={idx}>
              <b>{post.title}</b>
              {post.body}
            </p>
          ))}
        </div>
      )}
    </FetchView>
  );
};
```

## `<Async />` Component

> Unlike `FetchView`, it can display a spinner (see `CircularProgress`) indicating active data loading. If `id` changes, the request will be repeated using the `payload` prop.

```tsx
import { Async } from 'react-declarative'

import { CircularProgress } from '@mui/material'

const PostItem = ({
  id,
}) => {

  const { getPostById } = useBlogApi();

  return (
    <Async payload={id} Loader={CircularProgress}>
      {async (id) => {
        const { title, body } = await getPostById(id);
        return (
          <div>
            <p>{title}</p>
            <p>{body}</p>
          </div>
        );
      }}
    </Async>
  );
};
```

## `<Switch />` Component

> A router that makes it easy to configure caching and cache invalidation. For example, let's implement a role-based model.

```tsx
import { createProvider, fetchApi, singleshot } from 'react-declarative';

import sleep from '../utils/sleep';

const roleApiManager = new class {

  getRoles = singleshot(async () => {
    await sleep(5_000);
    return [
      'admin',
      // ...
    ]
  });

  hasRole = async (role) => {
    const roles = await this.getRoles();
    return roles.includes(role);
  };

  unload = () => {
    this.getRoles.clear();
  };

};

const [RoleApiProvider, useRoleApi] = createProvider(
  () => roleApiManager
);

export { roleApiManager, RoleApiProvider, useRoleApi };
```

On the page `/sample-page`, the list of roles may be required in several code sections, but the request should only be made once. After the user leaves the page, the cached list of roles should be reset.

```javascript
import { Switch } from 'react-declarative';

// ...

const routes = [
  {
    path: `/sample-page`,
    unload: roleApiManager.unload,
  },
];

// ...

const App = () => (
  <Switch history={history} items={routes} />
);
```

## `<If />` Component

> This component branches the view based on the truthfulness of the promise in `condition`. It can also re-request data when the `payload` changes.

```tsx
import { If } from 'react-declarative'

const ProfilePage = () => {
  const { hasRole } = useRoleApi();
  return (
    <If condition={() => hasRole("admin")}>
      <button>Button only for admin</button>
    </If>
  );
};
```

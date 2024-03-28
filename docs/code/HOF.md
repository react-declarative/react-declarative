# HOF

> accepts functions as parameters and/or returns a function

### `afterinit`

The `afterinit` function creates a wrapped version of a provided function, `run`. 

**Input** : 

- `run`: A function that takes parameters of type `P` and returns a `Promise<T>`. 

**Output** : 

- An object implementing the `IWrappedFn<T, P>` interface, containing: 
- A function that takes parameters of type `P` and returns a `Promise<T>`. 
- A `clear` function that resets the initial call state. 

**Behavior** :

- On the first call, it resolves a `Promise` and sets a flag to prevent further resolution unless cleared. 
- Subsequent calls execute `run` with the same arguments. 
- The `clear` function resets the initial call state.
### `cached`

The `cached` function creates a cached version of a provided function, `run`, improving performance by returning the previous result if called with the same arguments. 

**Input** : 

- `changed`: A function to check if arguments have changed. 
- `run`: The function to be cached. 

**Output** : 

- A function that behaves like `run` but caches results based on argument changes. 

**Behavior** :

- Maintains the last arguments, whether it's the initial run, and the last value. 
- Provides a `clear` function to reset the cache. 
- Re-evaluates `run` only if arguments have changed or on the first run.

### `cancelable`

The `cancelable` function wraps a provided function returning a promise, allowing cancellation. 

**Input** : 

- `promise`: A function returning a `Promise<T>` with arguments of type `P[]`. 

**Output** : 

- An object implementing the `IWrappedFn<T, P>` interface, with a `cancel` method. 

**Behavior** :

- Maintains a reference to cancel previous promises.
- Returns a function that can cancel previous promises and handles cancellation internally.

### `debounce`

The `debounce` function delays subsequent invocations of a function until a specified delay has passed. 

**Input** : 

- `run`: The function to debounce. 
- `delay` (optional): The delay in milliseconds (default: 1000ms). 

**Output** : 

- A function with the same signature as `run`, augmented with `clear` and `flush` methods. 

**Behavior** : 

- Schedules execution of `run` after a specified delay, clearing previous timeouts if called again. 
- Provides `clear` to cancel pending invocations and `flush` to execute `run` immediately.

### lock

The `lock` function wraps a promise function with locking capabilities to prevent simultaneous executions. It uses a BehaviorSubject to track the lock state and provides methods for managing the lock. This is useful for ensuring orderly asynchronous operations in applications.

### memoizes

The `memoize` function caches the result of function calls to improve performance. It stores the results associated with unique function arguments, allowing for reuse of cached results.

### queued

The `queued` function wraps a promise-making function and provides methods to cancel and clear queued promises. It ensures controlled execution of asynchronous tasks.

### retry

The `retry` function retries a promise function until it succeeds or reaches a maximum retry count. It provides a cancelable mechanism to stop retry attempts.

### singlerun

The `singlerun` function ensures that a function runs only once by wrapping it with a check for previous execution status. It also provides a method to clear the execution status.

### singleshot

The `singleshot` function memoizes the result of a function call and allows clearing the memoized result to enable re-execution of the function.

### singletick

The `singletick` function delays the execution of a function to the next event loop tick and provides a method to clear the delayed execution.

### throttle

The `throttle` function limits the rate of function execution by introducing a delay between successive invocations. It includes a method to clear pending executions.

### trycatch

The `trycatch` function wraps a function in a try-catch block and provides fallback behavior and default value handling in case of exceptions. It ensures graceful error handling during function execution.

### ttl

The `ttl` function enhances a given function with caching capabilities, allowing cached results to expire after a specified time. Here's a simplified breakdown: 

**Parameters** : 

- `run`: The original function to be cached. 
- `options`: An object with optional properties: 
- `key`: A function to generate cache keys (defaults to a function returning a constant). 
- `timeout`: Time-to-live duration for cached values, defaults to a preset value. 

**Return Value** : 

- Returns a new function (`executeFn`) with caching functionality. 

**Caching Mechanism** : 

- Memoizes the original function using `memoize`, storing return values and timestamps.
- Cached values are returned if within TTL; otherwise, the cache is refreshed by rerunning the original function. 
- Utilizes `IClearable` and `IRef` interfaces for cache management. 

**Garbage Collection** : 

- Implements a garbage collector (`gc`) to remove expired cache entries. 

**Generics and Higher-order Functions** :

- Utilizes generics and higher-order functions for adaptability across various data types and functionalities.

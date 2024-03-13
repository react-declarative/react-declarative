# TSubject

Interface representing a subject that can be subscribed to and trigger callbacks when data is updated.

## Properties

### subscribe

```ts
subscribe: (callback: (data: Data) => void) => () => void
```

### once

```ts
once: (callback: (data: Data) => void) => () => void
```

### next

```ts
next: (data: Data) => void
```

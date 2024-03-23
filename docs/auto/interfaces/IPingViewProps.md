# IPingViewProps

Represents the properties of the PingView component.

## Properties

### children

```ts
children: ReactNode
```

### Offline

```ts
Offline: ComponentType<any>
```

### ping

```ts
ping: (payload?: P) => boolean | Promise<boolean>
```

### fallback

```ts
fallback: (e: Error) => void
```

### throwError

```ts
throwError: boolean
```

### delay

```ts
delay: 5000
```

### payload

```ts
payload: P
```

### onOnline

```ts
onOnline: () => void
```

### onOffline

```ts
onOffline: () => void
```

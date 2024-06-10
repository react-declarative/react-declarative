# ICalendarViewProps

Interface representing the props for the CalendarView component.

## Properties

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

### itemSx

```ts
itemSx: SxProps<{}>
```

### dotSide

```ts
dotSide: number
```

### outlinePaper

```ts
outlinePaper: boolean
```

### transparentPaper

```ts
transparentPaper: boolean
```

### BeforeCalendarHeader

```ts
BeforeCalendarHeader: ComponentType<{ fromStamp: number; toStamp: number; payload: Payload; }>
```

### AfterCalendarHeader

```ts
AfterCalendarHeader: ComponentType<{ fromStamp: number; toStamp: number; payload: Payload; }>
```

### BeforeDayHeader

```ts
BeforeDayHeader: ComponentType<{ stamp: number; items: ICalendarItem<Data, Payload>[]; payload: Payload; }>
```

### AfterDayHeader

```ts
AfterDayHeader: ComponentType<{ stamp: number; items: ICalendarItem<Data, Payload>[]; payload: Payload; }>
```

### className

```ts
className: string
```

### style

```ts
style: CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

### fallback

```ts
fallback: (e: Error) => void
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### throwError

```ts
throwError: boolean
```

### handler

```ts
handler: ((req: ICalendarRequest<Payload>) => Omit<ICalendarItem<Data, Payload>, "payload">[]) | ((req: ICalendarRequest<Payload>) => Promise<...>)
```

### payload

```ts
payload: Payload | (() => Payload)
```

### date

```ts
date: dayjs.Dayjs
```

### minDate

```ts
minDate: dayjs.Dayjs
```

### maxDate

```ts
maxDate: dayjs.Dayjs
```

### tileMode

```ts
tileMode: TileMode
```

### onChange

```ts
onChange: (date: any) => void
```

### renderItem

```ts
renderItem: ComponentType<ICalendarTile<Data, Payload>>
```

### onItemClick

```ts
onItemClick: (item: { data: Data; payload: Payload; }) => void
```

### rowMark

```ts
rowMark: ((row: Data) => string) | ((row: Data) => Promise<string>)
```

### rowColor

```ts
rowColor: ((row: Data) => string) | ((row: Data) => Promise<string>)
```

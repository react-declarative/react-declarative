# Аудит: замена локальных утилит на functools-kit + багфиксы

Задача: (1) заменить локальные копии инструментов на реэкспорты из `functools-kit@^4.0.0` (реализации удалить),
(2) исправить подозрительные баги, покрыть тестами. Журнал, чтобы пережить compact.

## Статус: ЗАВЕРШЕНО
- `npx tsc --noEmit` — чисто
- `npx jest --env=jsdom` — 14 suites / 45 tests, все зелёные (до работ: 1 suite падал)

## Что сделано: реэкспорт-шимы (реализации удалены, файлы оставлены ради путей импорта)

Паттерн: `import { x } from "functools-kit"; export { x }; export default x;` + type-алиасы для локальных имён типов.

### src/utils/hof/ — все 18 файлов
afterinit, cached, cancelable, debounce, execpool, lock, memoize, obsolete, queued, retry,
singlerun, singleshot, singletick, throttle, timeout, trycatch, ttl, waitForNext.
Нюансы:
- локальный `CANCELED_SYMBOL` = реэкспорт `CANCELED_PROMISE_SYMBOL as CANCELED_SYMBOL` (обязательно alias-реэкспортом,
  иначе теряется unique symbol тип и ломается narrowing через `===`)
- локальные `IWrappedFn` → алиасы kit-типов `IWrappedCancelableFn`/`IWrappedQueuedFn`/... ;
  `IClearable` → `IDebounceClearable`/`ISinglerunClearable`/`IClearableTtl`/... (в singleshot оставлен локальный
  интерфейс `IClearable { clear }`, т.к. kit-овский generic)
- `GET_VALUE_MAP` из memoize удалён — использовался только локальным ttl (теперь тоже шим)

### src/utils/math/ — все 9: and, first, has, join, last, match, not, or, truely

### src/utils/rx/
- Subject, BehaviorSubject, Observer, EventEmitter, Operator — чистые шимы; локальные типы `TSubject`/`TObserver`/
  `TBehaviorSubject` продолжают реэкспортироваться из `src/model/*` (structural typing совместим, kit-классы — супермножество)
- Source — `class Source extends SourceBase` + локальный `fromEvent` (DOM-специфичный, в kit его НЕТ), реализован через `Source.create`
- Удалены подпапки rx/lib, rx/source, rx/helpers (использовались только локальными Source/Operator)
- `LISTEN_CONNECT`/`LISTEN_DISCONNECT` больше не экспортируются (kit их не экспортирует; использовались только внутри rx)

### src/utils/ (верхний уровень) — 21 файл
compareArray, compareFulltext, compose (+ локальный тип `Function` сохранён), create, createAwaiter (+ IAwaiter из kit),
deepClone, deepCompare, deepFlat, deepMerge, errorData, fetchApi (+ FetchError), formatText, get, getErrorMessage,
isEmpty, isObject, isUndefined, randomString, set, sleep, typo (деструктуризация из kit `typo`).

### Сопутствующие правки под типы kit
- One/components/OneInternal/OneInternal.tsx — `cached<any, any>` → `cached<any>` (kit cached принимает 1 generic)
- KanbanView/KanbanView.tsx:419-420 — `fetchLabel.clear(dragId.current!)` (kit memoize.clear ждёт `K | undefined`)

## Исправленные баги (+ тесты)

1. **utils/getMomentStamp.ts** — документирован как «London day stamp», но фактически сдвиги `removeUtcOffset` в
   getMomentStamp и getGenesisStamp взаимно сокращались → возвращался UTC-индекс дня; в BST (лето) граница дня
   съезжала на час, результат «зависел» от нагромождения machine-tz логики. Переписан честно через
   `Europe/London` wall clock (DST-aware, не зависит от таймзоны машины). `fromMomentStamp` — обратная операция.
   Тест `__tests__/getMomentStamp.test.ts` переписан детерминированно (старый был флаки: ожидание считалось до
   включения fake timers, время в цикле не двигалось — падал/проходил в зависимости от времени запуска).
2. **utils/promiseState.ts** — `promiseState`/`promiseValue` ВСЕГДА возвращали 'async'/null (`.then` — микротаска,
   выполняется после return). Из-за этого `If`-компонент всегда стартовал с `pass=false` даже для синхронных условий.
   Теперь `instanceof Promise`.
3. **utils/formatAmount.ts** — regex `/.00$/` с неэкранированной точкой: `formatAmount(1200, 0)` возвращал `"1"`.
   Исправлено на `/\.00$/`.
4. **utils/wordForm.ts** — проверка «teens» `value >= 11 && value < 20` работала только для чисел < 100:
   `wordForm(111)` давал форму «one». Теперь `value % 100` + `Math.abs`.
5. **utils/normalizeText.ts** — guard от не-строк вычислялся и тут же затирался (`result = "";`), при `null` падало
   на `text.length`. Теперь ранний `return ""`.
6. **utils/toRouteUrl.ts** — в `compile(template, { encode: ... })` передавался `decodeURIComponent` вместо
   `encodeURIComponent` — параметры не URL-кодировались.
7. **utils/wairForBlur.ts, wairForSize.ts** — опечатка в именах файлов, переименованы в `waitForBlur.ts`/`waitForSize.ts`
   (git mv), импорты в makeField.tsx и HeroLayout.tsx обновлены.

Тесты багфиксов: `src/utils/__tests__/bugfixes.test.ts` (9 тестов) и `src/utils/__tests__/getMomentStamp.test.ts` (4 теста).

## Замечено, но НЕ исправлено (осознанно, чтобы не менять поведение)
- CalendarView: асимметрия east/west таймзон в паре `getMomentStamp(addUtcOffset(day))` (Day.tsx) против
  `getMomentStamp(startOf("week"))` (CalendarHeader/Calendar) — возможен off-by-one индекса дня на западных машинах
  зимой (было и до правок). Требует решения о семантике stamp'ов в CalendarView.
- utils/getGenesisStamp.ts + addUtcOffset/removeUtcOffset — по-прежнему зависят от таймзоны машины
  (magic `OFFSET_ROUND_MINUTES = 60`); используются standalone в datetime.ts / DatePicker / KanbanView как
  "минимальная дата" — там это безвредно.
- utils/filterArray.ts экспортирует функцию `filterString` (несоответствие имени файла).
- utils/downloadBlank.ts — `fetch(..., { mode: 'no-cors' })` даёт opaque response, `.blob()` может быть пустым.
- utils/cacheSrc.ts — `URL.createObjectURL` без revoke (утечка object URL).
- utils/deepClone (теперь kit) — массивы объектов копируются поверхностно (slice), это поведение kit тоже.

## Этап 2: аудит src/components/One, OneButton, OneIcon

### Как устроен стейт One (конспект)
- `One.tsx` → `ApiProvider`/`PropsProvider` → `OneGenesis` → провайдеры (Cache/Debounce/OneContext/Radio/Feature/Payload/**State**/Menu/SlotFactory) → `OneInternal` (рекурсивно по layout'ам) → `createField` → `makeField(Component)`.
- `StateProvider` держит объект формы через `useResolved`; `useResolved` разрешает handler **только один раз** на корне (`isRoot`), дальше обновления идут через `changeSubject`/`updateSubject`/`apiRef` (ApiProvider) либо через объектный (не функциональный) handler + deepCompare.
- `makeField` — вся жизнь поля: `useFieldState` (единый useState), `useFieldMemory` (мутируемые refs `*$`), направление изменений определяется по смене ссылки `object` (incoming) vs `debouncedValueRef` (outgoing) в одном `useEffect [debouncedValueRef, object]`; флаги `memory.inputUpdate`/`objectUpdate` гасят эхо.
- `CacheProvider` — Map-кэши по ссылке field/fields для мемоизации коллбеков между рендерами; `waitingReady` в OneInternal — счётчик ready от statefull-полей, форма показывается после нуля.
- OneButton/OneIcon: `useAsyncValue` держит data, внутрь One передаётся `handler={() => data}` (→ resolve однократный), во время reload `loading` размонтирует всё дерево → ремоунт даёт свежий resolve; редактирование синхронизируется через onChange → setData.

### Исправленные баги (этап 2)
8. **makeField.tsx `waitForApply`** — `sleep(APPLY_DELAY)` в цикле ожидания вызывался БЕЗ `await`: цикл из 60 «попыток» прокручивался синхронно и мгновенно, очередь применения изменений (`withApplyQueue`) фактически не ждала сброса флагов inputUpdate/objectUpdate. Добавлен `await`.
9. **OneGenesis.tsx RadioProvider initialState** — `acm[name] || String(defaultValue) || null`: при отсутствии defaultValue radio-группа инициализировалась строкой `"undefined"` (String(undefined) — truthy). Теперь `defaultValue != null ? String(defaultValue) : null`.
10. **OneButton.tsx / OneIcon.tsx** — смена объектного `handler` снаружи обновляла бейдж (`setData`), но внутренняя форма One оставалась на старых данных навсегда: корневой One разрешает функциональный handler один раз (`isRoot`), а `handler={() => data}` — функция. Добавлен внутренний `oneChangeSubject` (`useSubject`), который прокидывается в One как `changeSubject` и эмитится в `useChange([handler])`. Reload через `reloadSubject` работал и раньше (через unmount/remount на `loading`).
    Про производительность пассфроу: subject стабилен (useSingleton) — проп не меняется, лишних рендеров нет; в `useResolved` локальный subject создаётся всегда, добавляется лишь одна подписка. Эмиссия защищена `deepCompare(data$.current, handler)` — инлайн-литерал `handler={{...}}` на каждый рендер родителя стоит один deepCompare, а не ре-рендер формы. Семантика `setData(null)` для falsy handler сохранена.

### Осмотрено без правок (этап 2)
One.tsx, OneGenesis, OneInternal (+CacheProvider), StateProvider, useResolved, makeField + hooks (useFieldState, useFieldMemory, useFieldGuard, useManagedCompute), useDebounceValue, useDebouncedCallback (порт lodash — ок), usePreventLeave, useItemList, useOnce/useSubject/useAsyncValue (в src/hooks), Radio slot.
Замечания без правок:
- makeField: коллбеки `useCallback([])` замыкают `managedProps` первого рендера — работает, потому что onChange/handleChange стабильны и ходят через memory-refs; менять не стал.
- OneInternal `handleReady`: счётчик уходит в минус при повторных ready от полей — безвредно (срабатывание только на === 0).
- usePreventLeave: `handleNavigate` не сбрасывает подписку при отказе от confirm — так и задумано (блокировка остаётся).

## Этап 3: даты переведены на get-moment-stamp@2.0.0 (pure-UTC библиотека)

Библиотека оперирует чистыми UTC-инстантами: `getMomentStamp(date) = floor(epoch/день)`, `getTimeStamp = UTC часы*60+минуты`.
Обёртки в src/utils нормализуют wall-clock компоненты dayjs в UTC (`Date.UTC(year, month, date)`) перед вызовом —
стамп зависит ТОЛЬКО от календарной даты/времени на часах, одинаково на любой машине. Это и убирает конфликт таймзон:
Day.tsx и CalendarHeader теперь стампуют симметрично без компенсаций.

- utils/getMomentStamp.ts — обёртка над get-moment-stamp; `dimension`-параметр удалён (нигде не использовался);
  fromMomentStamp возвращает dayjs локальной полуночи календарной даты (обратная операция, roundtrip точный)
- utils/getTimeStamp.ts — обёртка; семантика прежняя (wall-clock минуты)
- utils/getGenesisStamp.ts — `dayjs(fromMomentStamp(stamp = 0))`, ровно epoch; сигнатура сменилась с dayjs на число
- utils/datetime.ts — Date.toStamp/fromStamp и Time.fromStamp переведены на библиотеку (UTC-компоненты, machine-independent;
  починен old-баг: west-таймзоны получали off-by-one в Date.toStamp)
- utils/addUtcOffset.ts — УДАЛЁН (вместе с removeUtcOffset); из index.ts экспорт заменён на реэкспорт
  `isCurrentDate, isCurrentTime, fromTimeStampWithMoment` из get-moment-stamp
- CalendarView/Day.tsx — `getMomentStamp(addUtcOffset(day))` → `getMomentStamp(day)` (компенсация больше не нужна)
- rollup: менять не нужно, get-moment-stamp бандлится как dayjs/functools-kit (external только react/react-dom)
- Тесты: __tests__/getMomentStamp.test.ts переписан (9 тестов: календарная семантика, roundtrip'ы, genesis=epoch,
  getTimeStamp, datetime Date/Time стампы)

### Верификация CalendarView на новом апи
Статически: Calendar (запрос fromStamp/toStamp), CalendarHeader (слоты Before/After), Day (стамп ячейки, матчинг
items по `stamp === currentStamp`) — все ходят через одну и ту же обёртку getMomentStamp по календарной дате;
диапазон [start..end] покрывает ячейки недели ровно по +1 на дату. isToday — dayjs-плагин, от стампов не зависит.
MIN_DATE = genesis = epoch (dayjs(dayjs) — клон, работает).
Рантайм: src/__tests__/calendarview.test.tsx (2 теста) — рендер CalendarView через ReactDOM:
(1) handler получает диапазон, включающий сегодняшний стамп, ширина кратна 7 (28..42); ячейка «сегодня» подсвечена;
клик открывает popover с подзаголовком DD/MM/YYYY (рендерится только при смэтченных items) — матчинг работает;
(2) задача со стампом «вчера» в ячейку «сегодня» не попадает (заглушка «задач не назначено»).
В тесте замокан ResizeObserver (нужен Tile внутри popover, в jsdom отсутствует).

Breaking changes публичного API (осознанные, по указанию):
- удалены `addUtcOffset`/`removeUtcOffset`
- у getMomentStamp/fromMomentStamp пропал параметр `dimension`
- `getGenesisStamp(stamp)` теперь принимает число (moment stamp), не dayjs
- `getTimeStamp`/`fromMomentStamp` больше не тянут за собой сдвиги — значения стампов совпадают со старыми
  для восточных таймзон, для западных исправлен off-by-one

## Прочитано (аудит)
- package.json, node_modules/functools-kit/types.d.ts (все экспорты)
- Все файлы src/utils/hof, src/utils/math, src/utils/rx (+ бывшие подпапки), 21 top-level дубликат
- src/model/TSubject.ts, TObserver.ts, TBehaviorSubject.ts (поверхности)
- src/utils: getMomentStamp, getGenesisStamp, addUtcOffset, toUtcDate, getTimeStamp, promiseState, formatAmount,
  wordForm, removeSubstring, replaceSubstring, normalizeText, roundTicks, range, base64Json (частично), templateStr,
  formatStr, createDict, cacheSrc, removeExtraSpaces, arrays, filterArray, flatArray, objects, scaleRect, scaleToSize,
  mainColor, waitForBlur (ex-wair), waitForSize (ex-wair), waitForMove, waitForTab, waitForTouch, sha256, loadScript,
  openBlank, downloadBlank, getRouteItem, getRouteParams, parseRouteUrl, toRouteUrl, asciiParams, getXPathFromElement,
  getElementFromXPath, chooseFile (частично), datetime (частично), getFilterCount, getAvailableFields, getInitialData,
  getInvalidFields, getFieldsError, isInvalidFieldData, getMediaContext, getFieldVariant
- src/components: If/If.tsx, One/components/OneInternal/OneInternal.tsx (частично), KanbanView/KanbanView.tsx (частично)
- НЕ аудировано целиком: mvvm/ (Collection/Entity/Model — в kit их нет), oop/Pointer, crypt.js, heavy.tsx, list2grid,
  createLs*/createSs*/createStateProvider, createManagedHistory/createWindowHistory, компоненты вне списка выше.

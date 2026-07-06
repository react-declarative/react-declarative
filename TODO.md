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

## Этап 4: аудит KanbanView, InfiniteView, Grid, List, ScrollView, Switch, AutoSizer, Async

### Исправленные баги (этап 4)
11. **InfiniteView.tsx + VirtualView.tsx** — обработчик `scrollYSubject` был копипастой X-обработчика:
    проверял `scrollLeft` и скроллил по горизонтали (`scrollWidth`). Вертикальный скролл через subject не работал.
12. **Switch.tsx** — сортировка маршрутов по специфичности считала `path.match(/\\/g)` (обратные слэши,
    которых в путях нет) вместо `/\//g` — компаратор всегда сравнивал нули, сортировка не работала;
    маршрут `/user/:id` мог перехватывать `/user/settings` при "неудачном" порядке в items.
13. **Grid/api/useOffsetPaginator.ts** — с непустым `initialData` offset прибавлял `initialData.length`
    на каждой странице (пропуск строк), а initial-фетч затирал предзагруженные строки. Теперь initialData —
    «продолжение»: initial-фетч идёт с offset=len и конкатенируется, прирост prevOffset — ровно limit.
    Внутренние потребители (SearchView, ItemModal) initialData не передают — без регрессий.
14. **Grid/hooks/useSelection.tsx + List/hooks/useSelection.tsx** — синхронизация входящего пропа selectedRows
    эхом вызывала `onSelectedRows(..., initialChange=false)` — родитель получал собственное изменение как
    пользовательское. Теперь initialChange=true.
15. **List/api/useArrayPaginator.ts** — (а) `paginationHandler` при `rows.length <= limit` игнорировал offset:
    на infinite-scroll вторая страница дублировала первую, когда набор строк ровно равен limit;
    (б) `chipsHandler` задваивал строки, подходящие под несколько включённых чипов (`tmp.flat()` без дедупа).
16. **List/api/useApiPaginator.ts + One/api/useApiHandler.ts** — `abortSignal: signal = abortManager.signal`
    захватывал сигнал один раз на маунте; после любого `abortManager.abort()` (анмаунт другого списка/формы)
    компонент навсегда оставался с уже abort-нутым сигналом: каждый запрос мгновенно обрывался и молча
    возвращал пустой ответ. Теперь сигнал берётся из менеджера на каждый запрос.

Тесты: src/__tests__/arrayPaginator.test.tsx (4 теста — offset за пределами набора, частичная страница, дедуп чипов).

### Осмотрено без правок (этап 4)
- Async.tsx — `disabled` после первого включения не возвращается в true (похоже на замысел «once enabled»); flushSync в микротаске.
- ScrollView, AutoSizer (порт react-virtualized), KanbanView (вкл. enableScrollOnDrag: dispose по первому touchstart —
  осознанное отключение на тач-устройствах), Grid.tsx/Content/useCursorPaginator, List.tsx/useCachedRows/useUpsertManager.
- ПОДОЗРЕНИЯ БЕЗ ПРАВОК (меняют wire-формат, нужно решение):
  - useApiPaginator: дефолтный filterHandler шлёт `$lte:` для всех фильтров (ожидался бы `$eq`);
    `page = offset/limit` даёт 0-базные страницы, а nestjs-paginate (судя по синтаксису) ждёт 1-базные.
  - useArrayPaginator sortHandler: при мультисортировке последний столбец получает наивысший приоритет
    (последовательные .sort), обычно ожидается первый.
  - useCachedRows: selectedRows может содержать undefined для id, отсутствующих в rows.

## Этап 5: закрытие хвостов + аудит src/hooks и utils/mvvm

### Решения по этапу 4 (подтверждены)
- useApiPaginator `$lte:`/`page` — НЕ баг: бэкенд в итоге appwrite, `$lte` — осознанный фильтр по get-moment-stamp. Снято.

### Исправлено (этап 5)
17. **tsconfig.json: target es5 → es2017.** КРИТИЧНО: functools-kit@4 поставляется нативными ES2015-классами;
    ES5-транспилированный `extends` (Model/Collection extends EventEmitter, RouteManager extends Subject)
    падает в рантайме с "Class constructor cannot be invoked without 'new'" — т.е. сборка с kit v4 при es5
    была сломана для mvvm/routeManager. `makeExtendable` из kit не спасает ES5-подклассы (теряется прототип).
    tsc/jest/rollup с es2017 проходят.
18. **utils/mvvm/Entity.ts setData** — частичный `setData({поле})` без id генерировал НОВЫЙ случайный id
    (терялась идентичность, протухала `_ids`-карта Collection). Теперь id сохраняется, генерация — только
    если id не было вовсе. Тесты: src/utils/__tests__/mvvm.test.ts (6 шт.).
19. **utils/cacheSrc.ts** — revoke object URL по событию load картинки (утечка).
20. **utils/downloadBlank.ts** — убран `mode: 'no-cors'` (opaque response → пустой файл), добавлен
    `.catch`-фолбэк на прямую ссылку, якорь убирается из body после клика.
21. **utils/filterArray.ts → filterString.ts** (git mv, имя файла = имя функции), импорт в useArrayPaginator обновлён.
22. **useArrayPaginator sortHandler** — мультисортировка применяется в обратном порядке модели:
    приоритет у первого столбца (последовательные стабильные сорты).
23. **List/hooks/useCachedRows.tsx** — из selectedRows отфильтровываются undefined (id вне rows).

### Осмотрено без правок (этап 5)
- src/hooks: useActualState/Value/Callback/Ref, useSingleton, useChange, useChangeSubject, useForceUpdate,
  useReloadTrigger, useRenderWaiter, useChangeDelay, useAsyncAction, useQueuedAction, useSinglerunAction,
  useSubjectValue, useBehaviorSubject, useSource, useSubscription, useElementSize — чисто.
- utils/mvvm/Model.ts, Collection.ts (кроме Entity-фикса), oop/Pointer, createLsManager — чисто.
  Заметка: Collection._ids не обновляется при явной смене id сущности через setData({id: другой}) — краевой случай.
- НЕ аудировано глубоко: useSwipable (557), useCollection/useEntity/useModel биндинги, useContextMenu,
  useMediaStreamBuilder, useAsyncProgress, useSearchState, crypt.js, heavy.tsx, list2grid,
  createManagedHistory/createWindowHistory, FetchView/SearchView/OutletView/WizardView/Tile.

## Этап 6: полный аудит src/hooks (остаток ~40 хуков)

### Исправлено (этап 6)
24. **useModel/useEntity/useCollection (4 адаптера)** — `_waitForListeners` после dispose крутил 10мс-поллинг
    вечно: подписка на `_dispose` происходит после эмита, а BehaviorSubject не реплеит. Теперь `isDisposed`
    инициализируется текущим значением `_dispose.data` (тип параметра уточнён до BehaviorSubject<true>).
25. **useSearchState** — (а) unmount-ветка dispatchState была МЁРТВЫМ кодом: `mountRef.current = false`
    ставится синхронно после вызова, а guard `!mountRef.current → return` стоял до разбора action;
    guard перенесён внутрь "update". (б) unmount-очистка удаляла ВСЕ query-параметры страницы, включая
    чужие — добавлен фильтр по `${prefix}_`. Тест: src/__tests__/searchState.test.tsx.
26. **useSearchParams** — `parseInt` для числовых значений терял дробную часть ("1.5" → 1) — заменён на parseFloat.

### Осмотрено без правок (этап 6)
useSwipable (порт react-swipeable), useContextMenu, useAsyncProgress, useMediaStreamBuilder (spot-check),
useCollectionBinding/useEntityBinding/useModelBinding, useConfirm/usePrompt/useAlert/useDate/useTime,
useRequestSnackbar/useActionSnackbar (spot-check), useAudioPlayer, useFile, useItemModal, useList, useOne,
useListEditor, useLocalHistory, useRouteItem/useRouteParams, useMediaContext, useOneArray, useOneInput,
usePointer, usePreventAutofill (косметика: deps [onFocus] в handleTouchStart/handleContextMenu),
useSingleshot, useUserAgent, useWatchChanges, useDeepChangeSubject, useManagedCursor.
src/hooks и utils/mvvm — аудит ЗАВЕРШЁН.

## Этап 7: повторный прицельный аудит подписок в src/components/One

Проверены ВСЕ вхождения `.subscribe(` / `.once(` / `.connect(` / `useSubject` / `useChangeSubject` в поддереве
(полная карта grep, 25 call-sites) + все `addEventListener` + таймеры. Вердикт: новых багов не найдено.

Верифицировано по точкам:
- useResolved: unsubscribeAll+subscribe на ЛОКАЛЬНЫХ subject'ах (useSubject создаёт приватный мост) — чужих
  подписчиков не задевает; ре-подписка на смену handler корректна; cleanup моста в useSubject.
- usePreventLeave: подписка updateSubject с dtor; changeSubject-мост в One консистентен (drop/update/reload).
- useManagedProps: условные хуки стабилизированы useSingleton(UNCONTROLLED_STATE) — порядок хуков не ломается;
  controlled-мост data → propsChangeSubject корректен.
- Слоты Combo/Items/YesNo: once-паттерн с переприсвоением unsubscribeRef + cleanup [opened] — корректен;
  Time/Date/Complete/Items/Combo: `withContextMenu && requestSubject.subscribe(...)` возвращает dtor в effect.
- MenuProvider/MenuItems: один requestSubject на форму, подписка с dtor; queued-обёртка безвредна.
- Dict/SearchInput: reloadSubject-подписка с dtor; debounce с flush в cleanup.
- makeField: waitForMove/Tab/Touch — dtor'ы connect возвращаются из effect'ов; touchstart/click на groupRef
  с removeEventListener; условные хуки на oneConfig — модульная константа, порядок стабилен.
- CenterLayout: MutationObserver/ResizeObserver/resize — полный cleanup.

Сверка семантики kit vs старый локальный rx (критично после этапа 1):
- Subject.next ПРИВЯЗАН в конструкторе kit (bind) — мост `target.subscribe(result.next)` в useSubject работает;
- emit async в обоих; kit даже «синхроннее» (не await'ит не-промисы);
- once в kit отписывается ДО колбэка (старый — после) — безопаснее к реентерабельности;
- BehaviorSubject.subscribe не реплеит ни там, ни там (эталон для фикса №24).

## Этап 8: аудит FetchView, SearchView, OutletView, WizardView, Tile, RecordView

### Исправлено (этап 8)
27. **OutletModal.tsx** — `useEffect(() => setData(upperData), [open])`: `open` в компоненте НЕ определён,
    зависимость резолвилась в `window.open` (константа) — данные не сбрасывались при повторном открытии
    модалки. Открытость OutletModal — это `!!id`, зависимость исправлена на `[id]`
    (зеркально WizardOutletModal/SearchModal, где `open` определён и паттерн корректен).
28. **useOutletModal / useWizardModal / useTabsModal / useSearchModal** — все четыре хука возвращали
    `{ open, ... }` с НЕОПРЕДЕЛЁННЫМ `open` — наружу утекал `window.open` (всегда truthy функция),
    хотя документирован как «булево открытости». Теперь `get open()` от соответствующего subject'а
    (outletIdSubject/openSubject) — честное значение на момент чтения. useActionModal/useColumnConfig
    имеют настоящий useState open — не тронуты.
29. **Tile/TileItem.tsx** — на анмаунте строки чистился только кэш `rowMark`, но не `rowColor` —
    утечка memoize-кэша на длинных виртуальных списках.

### Осмотрено без правок (этап 8)
- FetchView — чисто (тонкая обёртка Async+Reveal).
- SearchView + SearchInput/SearchList — подписки с dtor; двойной reloadSubject.next при выборе item
  (useChange по value и item) — безвредное дублирование запроса… нет, queued в паginator гасит; не тронуто.
- OutletView — сложный, но консистентный: history.listen игнорирует PUSH (навигация аутлетов через
  REPLACE — соглашение, WizardView слушает только REPLACE); `readonly: readonly || hasChanged` в
  outletProps — семантика на стороне консюмера; waitForChanges вызывает handleLoadEnd(false) — похоже
  на осознанное «не рапортовать успех».
- WizardView/WizardOutletModal/WizardNavigation, useLocalHistory — чисто.
- Tile/TileContainer/useRowMark — подписки recomputeSubject/redrawAction с dtor.
- RecordView — свой deepFlat (path-ориентированный, НЕ kit-овский — не путать), SearchContext/Content/Item — чисто.

## Этап 9: аудит ModalManager/ModalProvider, Scaffold2/3, ChatView, ActionMenu, VisibilityView/FeatureView

### Исправлено (этап 9)
30. **ChatView/helpers/ChatController.ts `removeOnMessagesChanged`** — нейтрализовал обработчик в ЧУЖОМ
    массиве (`onActionChanged[idx]` вместо `onMessagesChanged[idx]`): отписка от сообщений ломала случайный
    action-обработчик, а подписчик сообщений оставался жить. Плюс guard idx !== -1 в обоих remove-методах.
31. **ChatView/ChatView.tsx** — подписки на ChatController добавлялись в effect БЕЗ cleanup (контроллер
    живёт вне React — на ремоунте слушатели копились; сломанный removeOnMessagesChanged это маскировал).
32. **ChatView/helpers/AudioMediaRecorder.ts** — накопление слушателей на синглтоне MediaRecorder:
    каждый startRecord вешал нового 'dataavailable' (со 2-й записи чанки аудио дублировались N раз),
    start/stop-слушатели тоже копились. dataavailable перенесён в initialize (однократно),
    start/stop — с { once: true }.
33. **ModalProvider useModal** — при анмаунте компонента с открытой модалкой элемент оставался в провайдере
    навсегда (у effect [open] не было cleanup). Добавлен cleanup handleClear на unmount открытого состояния.

### Осмотрено без правок (этап 9)
- ModalManagerProvider: `clearSubject` — МОДУЛЬНЫЙ синглтон, clear() в одном инстансе чистит стеки всех
  провайдеров приложения (One оборачивает каждую форму в свой ModalManagerProvider) — похоже на осознанный
  «глобальный сброс», не тронуто; Bootstrap ремоунтится через key в спреде {...modal} — корректно (неочевидно!).
- Scaffold2/StateContext — чисто; Scaffold3/StateContext — ПОБАЙТОВО идентичен (diff по нормализованным именам пуст).
- ActionMenu — подписок нет, loading-логика корректна.
- VisibilityView/FeatureView — декларативные обёртки над One, эффектов нет.

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

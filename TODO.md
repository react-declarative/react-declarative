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

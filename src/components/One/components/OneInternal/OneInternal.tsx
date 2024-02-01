import * as React from "react";
import { memo, useRef, useCallback, useEffect, Fragment, useMemo } from "react";

/* eslint-disable react/jsx-no-useless-fragment */

import isStatefull, { isLayout } from "../../config/isStatefull";
import createFieldInternal from "../../config/createField";
import createLayoutInternal from "../../config/createLayout";
import isBaseline from "../../config/isBaseline";

import { useOneState } from "../../context/StateProvider";
import { useOneCache } from "../../context/CacheProvider";
import { useOnePayload } from "../../context/PayloadProvider";

import { typeToString } from "../../helpers/typeToString";

import FieldType from "../../../../model/FieldType";
import IOneProps from "../../../../model/IOneProps";
import IEntity from "../../../../model/IEntity";
import IField from "../../../../model/IField";
import IAnything from "../../../../model/IAnything";

import cached from "../../../../utils/hof/cached";

/**
 * Мы отображаем корневой компонент только после инициализации
 * полей вложенных групп...
 */
const countStatefull = (fields: IField<any>[]) => {
  const { length: total } = fields.filter(isStatefull);
  return Math.max(total, 1);
};

interface IOneInternalProps<
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field extends IField<Data> = IField<Data>
> extends IOneProps<Data, Payload, Field> {
  rendered: boolean;
}

const DEFAULT_READY_CALLBACK = () => null;
const DEFAULT_INVALIDITY_CALLBACK = () => null;
const DEFAULT_FALLBACK = () => null;

const SHOULD_UPDATE_ITEM_LIST_DEFAULT: IField["shouldUpdateItemList"] = (
  prevData,
  currentData
) => prevData !== currentData;

const SHOULD_UPDATE_TR_DEFAULT: IField["shouldUpdateTr"] = (
  [prevValue],
  [currentValue]
) => prevValue !== currentValue;

/**
 * Подгрузка списка элементов списка по умолчанию
 * осуществляется только один раз
 */
const makeItemList = (field: IField, payload: IAnything) => {
  const { itemList, shouldUpdateItemList = SHOULD_UPDATE_ITEM_LIST_DEFAULT } =
    field;
  if (!itemList) {
    return undefined;
  }
  return Array.isArray(itemList)
    ? itemList
    : cached<any, any>(
        (prevArgs, currentArgs) =>
          shouldUpdateItemList(prevArgs[0], currentArgs[0], payload),
        itemList
      );
};

/**
 * Подгрузка переводов по умолчанию осуществляется
 * на каждый вызов
 */
const makeTr = (field: IField, payload: IAnything) => {
  const { tr, shouldUpdateTr = SHOULD_UPDATE_TR_DEFAULT } = field;
  if (!tr) {
    return undefined;
  }
  return cached<any, any>(
    (prevArgs, currentArgs) => shouldUpdateTr(prevArgs, currentArgs, payload),
    tr
  );
};

export const OneInternal = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field extends IField<Data> = IField<Data>
>({
  rendered = false,
  fields: upperFields = [],
  features,
  dirty,
  ready = DEFAULT_READY_CALLBACK,
  prefix = "root",
  invalidity = DEFAULT_INVALIDITY_CALLBACK,
  fallback = DEFAULT_FALLBACK,
  outlinePaper: upperOutlinePaper = false,
  readonly,
  focus,
  blur,
  menu,
  createField = createFieldInternal,
  createLayout = createLayoutInternal,
  withNamedPlaceholders,
}: IOneInternalProps<Data, Payload, Field>) => {

  const payload = useOnePayload();

  /**
   * Коллбеки вынесены из тела компонента для мемоизации
   */
  const {
    focusMap,
    blurMap,
    menuMap,
    baselineMap,
    fieldsMap,
    statefullMap,
    trMap,
    itemListMap,
  } = useOneCache();

  /**
   * Итерация дочерних полей на каждый рендеринг
   * порождает квадратичную сложность, мемоизируем
   */
  const { fields, statefull } = useMemo(() => {
    const fields = fieldsMap.has(upperFields)
      ? fieldsMap.get(upperFields)!
      : fieldsMap
          .set(
            upperFields,
            upperFields
              .filter(
                (field) =>
                  !features ||
                  !field.features ||
                  field.features.some((feature) => features.includes(feature))
              )
              .filter(({ hidden }) => {
                if (typeof hidden === 'function') {
                  hidden = hidden(payload);
                }
                return !hidden;
              })
              .filter(({ type }) => type !== FieldType.Init)
          )
          .get(upperFields)!;
    return {
      fields,
      statefull: statefullMap.has(upperFields)
        ? statefullMap.get(upperFields)!
        : statefullMap
            .set(upperFields, countStatefull(fields))
            .get(upperFields)!,
    };
  }, []);

  /**
   * Коллбек инициализации исполняется после вызова эффекта
   * входящего изменения каждого поля
   */
  const waitingReady = useRef(statefull);
  const { object, setObject } = useOneState<Data>();

  /**
   * Если в группе нет полей, вызываем инициализацию мануально
   */
  useEffect(() => {
    const { length: total } = fields;
    total == 0 && ready();
  }, []);

  /**
   * Изменяем локальный объект, сообщаем вышестоящему
   * компоненту о изменениях
   */
  const handleChange = useCallback(
    (v: Data, invalidMap: Record<string, boolean>) => {
      setObject(v, invalidMap);
    },
    []
  );

  /**
   * Отображение только после отрисовки всех полей
   * формы
   */
  const handleReady = useCallback(() => {
    if (--waitingReady.current === 0) {
      ready();
    }
  }, [ready]);

  if (object) {
    return (
      <Fragment>
        {fields.map((field, index) => {
          const currentPath = `${prefix}.${typeToString(field.type)}[${index}]`;
          const fields: IField<Data>[] = field.child
            ? [field.child]
            : field.fields || [];
          const entity: IEntity<Data> = {
            invalidity: field.invalidity || invalidity,
            readonly: readonly || field.readonly,
            prefix: currentPath,
            change: handleChange,
            ready: handleReady,
            fallback,
            isBaselineAlign:
              baselineMap.get(field) === undefined
                ? !!baselineMap
                    .set(field, !field.noBaseline && fields.some(isBaseline))
                    .get(field)
                : !!baselineMap.get(field),
            ...field,
            placeholder: withNamedPlaceholders
              ? `${field.name || "unknown"}`
              : field.placeholder,
            outlinePaper: field.outlinePaper || upperOutlinePaper,
            focus: focusMap.has(field)
              ? focusMap.get(field)
              : focusMap
                  .set(field, (name: string, data: Data, payload: Payload) => {
                    field.focus && field.focus(name, data, payload);
                    focus && focus(name, data, payload);
                  })
                  .get(field),
            blur: blurMap.has(field)
              ? blurMap.get(field)
              : blurMap
                  .set(field, (name: string, data: Data, payload: Payload) => {
                    field.blur && field.blur(name, data, payload);
                    blur && blur(name, data, payload);
                  })
                  .get(field),
            menu: menuMap.has(field)
              ? menuMap.get(field)
              : menuMap
                  .set(field, (name: string, action: string, data: Data, payload: Payload) => {
                    field.menu && field.menu(name, action, data, payload);
                    menu && menu(name, action, data, payload);
                  })
                  .get(field),
            tr: trMap.has(field)
              ? trMap.get(field)
              : trMap.set(field, makeTr(field, payload)).get(field),
            itemList: itemListMap.has(field)
              ? itemListMap.get(field)
              : itemListMap.set(field, makeItemList(field, payload)).get(field),
            object,
            dirty,
          };
          const one: IOneInternalProps<Data> = {
            rendered,
            ready: handleReady,
            prefix: currentPath,
            readonly: readonly || field.readonly,
            outlinePaper: entity.outlinePaper,
            withNamedPlaceholders,
            createField,
            createLayout,
            fields,
            features,
            handler: object,
            invalidity,
            focus,
            menu,
            blur,
            dirty,
          };
          if (isLayout(field.type)) {
            return createLayout(
              entity,
              <OneInternalMemo<Data> {...one} />,
              currentPath
            );
          } else {
            return createField(entity, currentPath);
          }
        })}
      </Fragment>
    );
  } else {
    return null;
  }
};

OneInternal.displayName = "OneInternal";

export const OneInternalMemo = memo(OneInternal) as typeof OneInternal;

export default OneInternalMemo;

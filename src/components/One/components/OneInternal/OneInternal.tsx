import * as React from "react";
import { memo, useRef, useCallback, useEffect, Fragment, useMemo } from "react";

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

/**
 * @typedef IOneInternalProps - Props for the OneInternal component
 * @template Data - The data type
 * @template Payload - The payload type
 * @template Field - The field type
 * @property rendered - Whether the component has been rendered
 * @property fields - The fields array
 * @property features - The features array
 * @property dirty - Whether the fields are dirty
 * @property ready - The ready callback function
 * @property prefix - The prefix string
 * @property invalidity - The invalidity callback function
 * @property fallback - The fallback callback function
 * @property outlinePaper - Whether to use outline paper
 * @property transparentPaper - Whether to use transparent paper
 * @property readonly - Whether the fields are readonly
 * @property focus - The focus callback function
 * @property blur - The blur callback function
 * @property click - The click callback function
 * @property menu - The menu callback function
 * @property createField - The createField function
 * @property createLayout - The createLayout function
 * @property withNamedPlaceholders - Whether to use named placeholders
 */
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
  transparentPaper: upperTransparentPaper = false,
  readonly,
  focus,
  blur,
  click,
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
    clickMap,
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
            /**
             * Checks if a given field is baseline aligned.
             *
             * @param {Object} field - The field object to check.
             * @param {Map} baselineMap - The map containing the baseline information.
             * @param {Array} fields - The array of fields to check for baselines.
             * @returns {boolean} Returns true if the field is baseline aligned, false otherwise.
             */
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
            transparentPaper: field.transparentPaper || upperTransparentPaper,
            /**
             * Retrieves the function associated with the given field from the click map.
             * If no function is found, returns the click map itself.
             *
             * @param {string} field - The field to search in the click map.
             * @returns {function|Map} - The function associated with the field, or the click map.
             */
            click: clickMap.has(field)
              ? clickMap.get(field)
              : clickMap
                  .set(field, (name, e, data, payload, onValueChange, onChange) => {
                    field.click && field.click(name, e, data, payload, onValueChange, onChange);
                    click && click(name, data, payload, onValueChange, onChange);
                  })
                  .get(field),
            /**
             * Determines if the provided field exists in the focusMap.
             *
             * If the field exists, the corresponding value is returned from the focusMap.
             * If the field does not exist, the focusMap is updated with a new value created as a function.
             * The function takes in parameters and calls "focus" and "focus" (if they exist) passing in the parameters.
             * Then, the updated value is returned from the focusMap.
             *
             * @param {string} field - The field to check in the focusMap.
             * @returns {any} - The value associated with the field in the focusMap.
             */
            focus: focusMap.has(field)
              ? focusMap.get(field)
              : focusMap
                  .set(field, (name, data, payload, onValueChange, onChange) => {
                    field.focus && field.focus(name, data, payload, onValueChange, onChange);
                    focus && focus(name, data, payload, onValueChange, onChange);
                  })
                  .get(field),
            /**
             * Checks if a field exists in the blur map, and returns its value if found.
             * If the field does not exist, it adds a new entry to the blur map and returns it.
             * The new entry is a function that invokes the `blur` method of the `field`, if available,
             * and then invokes the `blur` method passed as an argument.
             *
             * @param {object} field - The field to check or add to the blur map.
             * @returns {function} - The value associated with the field in the blur map,
             *                       or a new function added to the blur map for the field.
             */
            blur: blurMap.has(field)
              ? blurMap.get(field)
              : blurMap
                  .set(field, (name, data, payload, onValueChange, onChange) => {
                    field.blur && field.blur(name, data, payload, onValueChange, onChange);
                    blur && blur(name, data, payload, onValueChange, onChange);
                  })
                  .get(field),
            /**
             * Checks if field exists in the menuMap. If it exists, return the menu function associated with the field.
             * If it does not exist, create a new entry in the menuMap and associate it with a new menu function defined
             * by the provided parameters and return the menu function.
             *
             * @param {string} field - The field to check in the menuMap.
             *
             * @returns {function} - The menu function associated with the field in the menuMap.
             */
            menu: menuMap.has(field)
              ? menuMap.get(field)
              : menuMap
                  .set(field, (name, action, data, payload, onValueChange, onChange) => {
                    field.menu && field.menu(name, action, data, payload, onValueChange, onChange);
                    menu && menu(name, action, data, payload, onValueChange, onChange);
                  })
                  .get(field),
            /**
             * Checks if a field exists in the trMap. If the field exists, it returns the corresponding translation. If the field does not exist, it creates a new translation using the `makeTr`
             * function, stores it in the trMap, and returns the translation.
             *
             * @param {string} field - The field to check in the trMap.
             * @param {any} payload - The payload to use when creating a new translation.
             * @returns {string} - The translation for the specified field.
             */
            tr: trMap.has(field)
              ? trMap.get(field)
              : trMap.set(field, makeTr(field, payload)).get(field),
            /**
             * Returns the itemList for the given field. If the field exists in the itemListMap,
             * the corresponding itemList is returned. Otherwise, a new itemList is created using
             * makeItemList function and added to the itemListMap.
             *
             * @param {string} field - The field for which to get the itemList.
             * @param {any} payload - The payload to be used in makeItemList function.
             * @returns {any[]} - The itemList for the given field.
             */
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
            transparentPaper: entity.transparentPaper,
            withNamedPlaceholders,
            createField,
            createLayout,
            fields,
            features,
            handler: object,
            invalidity,
            focus,
            click,
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

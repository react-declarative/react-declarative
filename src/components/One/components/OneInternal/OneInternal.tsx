import * as React from "react";
import {
  memo,
  useRef,
  useCallback,
  useEffect,
  Fragment,
  useMemo,
} from "react";

/* eslint-disable react/jsx-no-useless-fragment */

import isStatefull, { isLayout } from "../../config/isStatefull";
import createFieldInternal from "../../config/createField";
import createLayoutInternal from "../../config/createLayout";

import { useOneState } from "../../context/StateProvider";

import { typeToString } from "../../helpers/typeToString";

import FieldType from "../../../../model/FieldType";
import IOneProps from "../../../../model/IOneProps";
import IEntity from "../../../../model/IEntity";
import IField from "../../../../model/IField";
import IAnything from "../../../../model/IAnything";
import isBaseline from "../../config/isBaseline";

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
const EMPTY_ARRAY: unknown[] = [];

export const OneInternal = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field extends IField<Data> = IField<Data>
>({
  rendered = false,
  fields: upperFields = EMPTY_ARRAY as Field[],
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
  createField = createFieldInternal,
  createLayout = createLayoutInternal,
  withNamedPlaceholders,
}: IOneInternalProps<Data, Payload, Field>) => {

  /**
   * Итерация дочерних полей на каждый рендеринг
   * порождает квадратичную сложность, мемоизируем
   */
  const {
    fields,
    statefull,
  } = useMemo(() => {
    const fields = upperFields
      .filter(
        (field) =>
          !features ||
          !field.features ||
          field.features.some((feature) => features.includes(feature))
      )
      .filter(({ hidden }) => !hidden)
      .filter(({ type }) => type !== FieldType.Init);
    return {
      fields,
      statefull: countStatefull(fields),
    };
  }, []);

  /**
   * Коллбек инициализации исполняется после вызова эффекта
   * входящего изменения каждого поля
   */
  const waitingReady = useRef(statefull);
  const { object, setObject } = useOneState<Data>();

  /**
   * Коллбеки вынесены из тела компонента для мемоизации
   */
  const {
    focusMap,
    blurMap,
    baselineMap,
  } = useMemo(() => {
    const fnMap = Object.create(null);
    Object.assign(fnMap, {
      focusMap: new Map<IField, (name: string, payload: Payload) => void>(),
      blurMap: new Map<IField, (name: string, payload: Payload) => void>(),
      baselineMap: new Map<IField, boolean>(),
    });
    return fnMap;
  }, []);

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
            isBaselineAlign: baselineMap.get(field) === undefined
              ? !!baselineMap.set(field, !field.noBaseline && fields.some(isBaseline)).get(field)
              : !!baselineMap.get(field),
            ...field,
            placeholder: withNamedPlaceholders ? `${field.name || 'unknown'}` : field.placeholder,
            outlinePaper: field.outlinePaper || upperOutlinePaper,
            focus: focusMap.has(field)
              ? focusMap.get(field)
              : focusMap
                .set(field, (name: string, payload: Payload) => {
                  field.focus && field.focus(name, payload);
                  focus && focus(name, payload);
                })
                .get(field),
            blur: blurMap.has(field)
              ? blurMap.get(field)
              : blurMap
                .set(field, (name: string, payload: Payload) => {
                  field.blur && field.blur(name, payload);
                  blur && blur(name, payload);
                })
                .get(field),
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
            blur,
            dirty,
          };
          if (isLayout(field.type)) {
            return createLayout(entity, <OneInternalMemo<Data> {...one} />, currentPath);
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

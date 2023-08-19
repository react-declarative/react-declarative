import * as React from "react";
import {
  memo,
  useRef,
  useCallback,
  useEffect,
  useState,
  Fragment,
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

/**
 * Мы отображаем корневой компонент только после инициализации
 * полей вложенных групп...
 */
const countStatefull = (fields?: IField<any>[]) => {
  let total = fields?.filter(isStatefull).length || 0;
  if (fields) {
    total -= fields.reduce((acm, { hidden }) => (hidden ? acm + 1 : acm), 0);
    total -= fields.reduce(
      (acm, { type }) => (type === FieldType.Init ? acm + 1 : acm),
      0
    );
  }
  /* группа, вложенная в группу */
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
const DEFAULT_FALLBACK =() => null;

export const OneInternal = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field extends IField<Data> = IField<Data>
>({
  rendered = false,
  fields,
  roles,
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
}: IOneInternalProps<Data, Payload, Field>) => {
  const waitingReady = useRef(countStatefull(fields));
  const [focusMap] = useState(
    () => new WeakMap<IField, (name: string, payload: Payload) => void>()
  );
  const [blurMap] = useState(
    () => new WeakMap<IField, (name: string, payload: Payload) => void>()
  );
  const { object, setObject } = useOneState<Data>();
  const [hasAnimationFrame, setHasAnimationFrame] = useState(false);

  /**
   * Если в группе нет полей, вызываем инициализацию мануально
   */
  useEffect(() => {
    if (fields) {
      const { length: total } = fields
        .filter(isStatefull)
        .filter(({ hidden }) => !hidden)
        .filter(({ type }) => type === FieldType.Init)
      total == 0 && ready();
      return;
    }
    ready();
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

  /**
   * Предотвращает performWorkUntilDeadline stuck
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      setHasAnimationFrame(true);
    });
  }, []);

  if (!hasAnimationFrame) {
    return null;
  } else if (object) {
    return (
      <Fragment>
        {fields
          ?.filter(
            (field) =>
              !roles ||
              !field.roles ||
              field.roles.some((role) => roles.includes(role))
          )
          ?.map((field, index) => {
            const currentPath = `${prefix}.${typeToString(field.type)}[${index}]`;
            const entity: IEntity<Data> = {
              invalidity: field.invalidity || invalidity,
              readonly: readonly || field.readonly,
              prefix: currentPath,
              change: handleChange,
              ready: handleReady,
              fallback,
              ...field,
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
            const fields: IField<Data>[] = field.child
              ? [field.child]
              : field.fields || [];
            const one: IOneInternalProps<Data> = {
              rendered,
              ready: handleReady,
              prefix: currentPath,
              readonly: readonly || field.readonly,
              outlinePaper: entity.outlinePaper,
              createField,
              createLayout,
              fields,
              roles,
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

import deepClone from "./deepClone";
import deepFlat from "./deepFlat";

import IField from "../model/IField";

const hideNestingVisibility = (
  entry: IField,
  data: Record<string, any>,
  payload: Record<string, any>
) => {
  const { isVisible = () => true, isDisabled = () => false } = entry;
  if (!isVisible(data, payload) || isDisabled(data, payload)) {
    if (entry.fields) {
      for (const field of entry.fields) {
        field.isVisible = () => false;
        hideNestingVisibility(field, data, payload);
      }
    }
    if (entry.child) {
      entry.child.isVisible = () => false;
      hideNestingVisibility(entry.child, data, payload);
    }
  }
};

const buildCommonResult = (
  upper_fields: IField[],
  data: Record<string, any>,
  payload: Record<string, any>
) => {
  const result: IField[] = [];
  let fields: IField[] = deepClone(upper_fields);
  fields = deepFlat<IField>(fields);
  fields.forEach((field) => hideNestingVisibility(field, data, payload));
  for (const field of fields) {
    const { isVisible = () => true } = field;
    if (!isVisible(data, payload)) {
      continue;
    }
    result.push();
  }
  return result;
};

export const getAvailableFields = (
  fields: IField[],
  data: Record<string, any>,
  payload: Record<string, any>,
  features?: string[]
) =>
  buildCommonResult(fields, data, payload).filter(
    (field) =>
      !features ||
      !field.features ||
      field.features.some((feature) => features.includes(feature))
  );

export default getAvailableFields;

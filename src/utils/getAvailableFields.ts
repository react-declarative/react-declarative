import deepFlat from "./deepFlat";

import IField from "../model/IField";

const buildCommonResult = (
  fields: IField[],
  data: Record<string, any>,
  payload: Record<string, any>
) => {

  const ignore = new Set<IField>();

  const ignoreNestingVisibility = (
    entry: IField,
    data: Record<string, any>,
    payload: Record<string, any>
  ) => {
    const { isVisible = () => true, isDisabled = () => false } = entry;
    if (!isVisible(data, payload) || isDisabled(data, payload)) {
      ignore.add(entry);
      if (entry.fields) {
        for (const field of entry.fields) {
          ignore.add(field);
          ignoreNestingVisibility(field, data, payload);
        }
      }
      if (entry.child) {
        ignore.add(entry.child);
        ignoreNestingVisibility(entry.child, data, payload);
      }
    }
  };

  fields = deepFlat(fields);
  fields.forEach((field) => ignoreNestingVisibility(field, data, payload));
  fields = fields.filter((field) => !ignore.has(field));

  return fields;
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

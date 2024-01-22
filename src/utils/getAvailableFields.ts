import deepFlat from "./deepFlat";

import IField from "../model/IField";
import IOnePublicProps from "../model/IOnePublicProps";

const buildCommonResult = (
  fields: IField[],
  data: Record<string, any>,
  payload: Record<string, any>
) => {
  const ignore = new Set<IField>();

  const ignoreNestingVisibility = (
    entry: IField,
    data: Record<string, any>,
    payload: Record<string, any>,
    hidden = false
  ) => {
    const { isVisible = () => true, isDisabled = () => false } = entry;
    if (
      typeof entry.hidden === "function" ? entry.hidden(payload) : entry.hidden
    ) {
      hidden = true;
    }
    if (!isVisible(data, payload) || isDisabled(data, payload)) {
      hidden = true;
    }
    if (hidden) {
      ignore.add(entry);
    }
    if (entry.fields) {
      for (const field of entry.fields) {
        ignoreNestingVisibility(field, data, payload, hidden);
      }
    }
    if (entry.child) {
      ignoreNestingVisibility(entry.child, data, payload, hidden);
    }
  };

  fields = deepFlat(fields);
  fields.forEach((field) => ignoreNestingVisibility(field, data, payload));
  fields = fields.filter((field) => !ignore.has(field));

  const hidden = [...ignore].filter(
    ({ name }) => !fields.some((field) => field.name === name)
  );

  return {
    visible: fields,
    hidden,
  };
};

const resolveFeatues = (upperFeatures: IOnePublicProps["features"]) => {
  let result = upperFeatures;
  if (typeof upperFeatures === "function") {
    result = upperFeatures();
  }
  if (result && !Array.isArray(result)) {
    result = Object.entries(result)
      .map(([key, value]) => (value ? key : (null as never)))
      .filter((value) => !!value);
  }
  return result;
};

export const getAvailableFields = (
  fields: IField[],
  data: Record<string, any>,
  payload: Record<string, any>,
  _features?: IOnePublicProps["features"]
) => {
  const features = resolveFeatues(_features);
  return buildCommonResult(
    fields.filter(
      (field) =>
        !features ||
        !field.features ||
        field.features.some((feature) => features.includes(feature))
    ),
    data,
    payload
  );
};

export default getAvailableFields;

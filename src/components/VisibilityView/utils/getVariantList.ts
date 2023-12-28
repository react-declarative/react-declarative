import deepFlat from "../../../utils/deepFlat";

import FieldType from "../../../model/FieldType";
import IField from "../../../model/IField";

const VARIANT_FIELD_TYPE = new Set([
  FieldType.Text,
  FieldType.Time,
  FieldType.Date,
  FieldType.Items,
  FieldType.Combo,
  FieldType.Checkbox,
  FieldType.Choose,
  FieldType.Complete,
  FieldType.Radio,
  FieldType.YesNo,
  FieldType.Switch,
  FieldType.Component,
]);

export const getVariantList = (fields: IField[], keyToTitle = (v: string) => v) => {
  const variantList: { label: string; value: string }[] = [];
  for (const { name, type, title, placeholder } of deepFlat<IField>(
    fields
  )) {
    if (!name) {
      continue;
    }
    if (variantList.some((variant) => variant.value === name)) {
      continue;
    }
    if (VARIANT_FIELD_TYPE.has(type)) {
      variantList.push({
        label: title || placeholder || keyToTitle(name),
        value: name,
      });
    }
  }
  return variantList;
}

export default getVariantList;

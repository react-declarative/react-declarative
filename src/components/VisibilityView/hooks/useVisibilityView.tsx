import { useMemo } from 'react';

import { useActionModal, IParams as IActionModalParams } from "../../ActionModal";

import keyToTitleDefault from "../utils/keyToTitle";
import getVariantList from "../utils/getVariantList";

import IVisibilityViewProps from "../model/IVisibilityViewProps";
import IField from '../../../model/IField';
import FieldType from '../../../model/FieldType';

type Data = Record<string, string[]>;
type State = Record<string, Record<string, boolean>>;

/**
 * Interface for defining parameters for a class.
 * @interface
 * @extends IVisibilityViewProps
 * @extends Omit<IActionModalParams, 'changeSubject'>
 */
interface IParams
  extends Omit<
    IVisibilityViewProps,
    keyof {
      changeSubject: never;
    }
  > {
  fullScreen: IActionModalParams["fullScreen"];
  fallback: IActionModalParams["fallback"];
  onLoadStart: IActionModalParams["onLoadStart"];
  onLoadEnd: IActionModalParams["onLoadEnd"];
  onSubmit?: (data: Data | null) => boolean | Promise<boolean>;
  submitLabel: IActionModalParams["submitLabel"];
}

/**
 * Initializes and returns a visibility view component.
 *
 * @param params - The configuration parameters.
 * @param params.groups - The groups of fields to display.
 * @param params.data - The initial data values.
 * @param params.keyToTitle - The function to generate a title from a key.
 * @param params.expandAll - Flag indicating if all fields should be expanded by default.
 * @param params.readonly - Flag indicating if the view should be readonly.
 * @param params.fullScreen - Flag indicating if the view should be displayed in full screen.
 * @param params.fallback - The component to display if the main component fails to load.
 * @param params.onLoadStart - The function to call when the view starts loading.
 * @param params.onLoadEnd - The function to call when the view finishes loading.
 * @param params.onSubmit - The function to call when the form is submitted.
 * @param params.onChange - The function to call when the form's data changes.
 * @param params.submitLabel - The label for the submit button.
 * @returns - The visibility view component.
 */
export const useVisibilityView = ({
  groups,
  data,
  keyToTitle = keyToTitleDefault,
  expandAll,
  readonly,
  fullScreen,
  fallback,
  onLoadStart,
  onLoadEnd,
  onSubmit,
  onChange,
  submitLabel,
}: IParams) => {
  const fields = useMemo(
    (): IField[] =>
      groups.map(({ fields, name, title, description }, idx) => {
        const variantList = getVariantList(fields, keyToTitle);
        return {
          type: FieldType.Expansion,
          fieldBottomMargin: idx === groups.length - 1 ? "0" : "1",
          expansionOpened: expandAll,
          title: title || keyToTitle(name),
          description,
          fields: variantList.map(({ label, value }) => ({
            type: FieldType.Checkbox,
            name: `${name}.${value}`,
            readonly,
            title: `${label} (${value})`,
            defaultValue: false,
          })),
        };
      }),
    []
  );

  const value = useMemo(() => {
    if (!data) {
      return {};
    }
    return groups.reduce<State>((acm, { name, fields }) => {
      const variantList = getVariantList(fields);
      const variantSet = new Set(data[name]);
      return {
        ...acm,
        ...variantList.reduce(
          (acm: any, { value }: any) => ({
            [name]: {
              ...acm[name],
              [value]: variantSet.has(value),
            },
          }),
          {}
        ),
      };
    }, {});
  }, [data]);

  return useActionModal({
    fullScreen,
    fallback,
    onLoadStart,
    onLoadEnd,
    handler: () => value,
    onSubmit: async (state) => {
      if (state) {
        const data: Data = {};
        for (const [key, value] of Object.entries(state)) {
          data[key] = Object.entries(value)
            .filter(([, value]) => value)
            .map(([key]) => key);
        }
        if (onSubmit) {
          return await onSubmit(data);
        }
      }
      return true;
    },
    onChange: (state: State, initial: boolean) => {
      if (initial) {
        return;
      }
      const data: Data = {};
      for (const [key, value] of Object.entries(state)) {
        data[key] = Object.entries(value)
          .filter(([, value]) => value)
          .map(([key]) => key);
      }
      onChange && onChange(data);
    },
    submitLabel,
    transparentPaper: true,
    payload: { readonly },
    fields,
  });
};

export default useVisibilityView;

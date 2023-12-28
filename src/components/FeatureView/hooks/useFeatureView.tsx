import { useActionModal, IParams as IActionModalParams } from "../../ActionModal";
import createFeatures from "../helpers/createFeatures";
import IFeatureViewProps from "../model/IFeatureViewProps";

interface IParams extends Omit<IFeatureViewProps, keyof {
  changeSubject: never;
}> {
  fullScreen: IActionModalParams['fullScreen'];
  fallback: IActionModalParams['fallback'];
  onLoadStart: IActionModalParams['onLoadStart'];
  onLoadEnd: IActionModalParams['onLoadEnd'];
  onSubmit?: (data: string[] | null) => (boolean | Promise<boolean>);
  submitLabel: IActionModalParams['submitLabel'];
}

export const useFeatureView = ({
  data,
  features,
  expandAll,
  readonly,
  fullScreen,
  fallback,
  onLoadStart,
  onLoadEnd,
  onSubmit,
  onChange,
  submitLabel,
}: IParams) =>
  useActionModal({
    fullScreen,
    fallback,
    onLoadStart,
    onLoadEnd,
    handler: () => {
      if (!data) {
        return {};
      }
      return data.reduce(
        (acm, cur) => ({
          ...acm,
          [cur]: true,
        }),
        {}
      );
    },
    onSubmit: async (data) => {
      if (data) {
        const features = Object.entries(data)
          .filter(([_, value]) => !!value)
          .map(([key]) => key);
        if (onSubmit) {
          return await onSubmit(features);
        }
      }
      return true;
    },
    onChange: (data, initial) => {
      if (data && !initial) {
        const features = Object.entries(data)
          .filter(([_, value]) => !!value)
          .map(([key]) => key);
        onChange && onChange(features);
      }
    },
    submitLabel,
    outlinePaper: true,
    payload: { readonly },
    fields: createFeatures(features, expandAll),
  });

export default useFeatureView;

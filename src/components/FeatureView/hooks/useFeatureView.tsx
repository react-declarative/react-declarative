import { useActionModal, IParams as IActionModalParams } from "../../ActionModal";
import createFeatures from "../helpers/createFeatures";
import IFeatureViewProps from "../model/IFeatureViewProps";

interface IParams extends IFeatureViewProps {
  fullScreen: IActionModalParams['fullScreen'];
  fallback: IActionModalParams['fallback'];
  onLoadStart: IActionModalParams['onLoadStart'];
  onLoadEnd: IActionModalParams['onLoadEnd'];
  onSubmit?: (data: string[] | null) => (void | Promise<void>);
  submitLabel: IActionModalParams['submitLabel'];
}

export const useFeatureView = ({
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
    onSubmit: async (data) => {
      if (data) {
        const features = Object.entries(data)
          .filter(([_, value]) => !!value)
          .map(([key]) => key);
        if (onSubmit) {
          await onSubmit(features);
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

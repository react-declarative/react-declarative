import { useActionModal, IParams as IActionModalParams } from "../../ActionModal";
import createFeatures from "../helpers/createFeatures";
import IFeatureViewProps from "../model/IFeatureViewProps";

interface IParams extends Omit<IFeatureViewProps, keyof {
  changeSubject: never;
}> {
  title: IActionModalParams['title']; 
  fullScreen: IActionModalParams['fullScreen'];
  fallback: IActionModalParams['fallback'];
  onLoadStart: IActionModalParams['onLoadStart'];
  onLoadEnd: IActionModalParams['onLoadEnd'];
  onSubmit?: (data: string[] | null) => (boolean | Promise<boolean>);
  submitLabel: IActionModalParams['submitLabel'];
  withStaticAction?: IActionModalParams['withStaticAction'];
  withActionButton?: IActionModalParams['withActionButton'];
}

/**
 * Custom hook for displaying a feature view modal.
 *
 * @param params - The parameters for the feature view modal.
 * @param params.data - The feature data.
 * @param params.title - The title of the modal.
 * @param params.features - The features to display.
 * @param params.expandAll - Whether to expand all feature sections.
 * @param params.readonly - Whether the modal is readonly.
 * @param params.fullScreen - Whether the modal should be displayed in full screen.
 * @param params.fallback - The fallback react element to display if modal content is unavailable.
 * @param params.onLoadStart - Callback function to be called when modal starts to load.
 * @param params.onLoadEnd - Callback function to be called when modal finishes loading.
 * @param params.onSubmit - Callback function to be called when modal is submitted.
 * @param params.onChange - Callback function to be called when modal value changes.
 * @param params.submitLabel - The label for the submit button.
 * @param params.withActionButton - Whether to include an action button in the modal.
 * @param params.withStaticAction - Whether to include a static action in the modal.
 * @return - The modal hook object.
 */
export const useFeatureView = ({
  data,
  title,
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
  withActionButton = true,
  withStaticAction = false,
}: IParams) =>
  useActionModal({
    title,
    withStaticAction,
    withActionButton,
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

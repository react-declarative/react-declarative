import IAnything from "../../model/IAnything";
import { useActionModal, IParams } from "../ActionModal";
import createFeatures from "./helpers/createFeatures";
import IFeatureViewProps from "./model/IFeatureViewProps";

export const useFeatureView = <
  Data extends IAnything = IAnything,
  Payload = IAnything
>({
  features,
  expandAll,
  ...oneProps
}: IFeatureViewProps<Data, Payload> &
  Omit<
    IParams<Data, Payload>,
    keyof {
      features: never;
    }
  >) =>
  useActionModal({
    ...oneProps,
    outlinePaper: true,
    fields: createFeatures(features, expandAll),
  });

export default useFeatureView;

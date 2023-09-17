import IAnything from "../../model/IAnything";
import { useActionModal } from "../ActionModal";
import createFeatures from "./helpers/createFeatures";
import IFeatureViewProps from "./model/IFeatureViewProps";

export const useFeatureView = <
    Data extends IAnything = IAnything,
    Payload = IAnything
>({
    features,
    expandAll,
    ...oneProps
}: IFeatureViewProps<Data, Payload>) => useActionModal({
    ...oneProps,
    outlinePaper: true,
    fields: createFeatures(features, expandAll),
});

export default useFeatureView;

import { IMasterDetailOptionInternal } from '../../model/IMasterDetailOption';
import IMasterDetailProps from '../../model/IMasterDetailProps';

/**
 * Interface for the props of the Content component.
 */
export interface IContentProps {
    children: React.ReactNode;
    loading: boolean;
    mode: Exclude<IMasterDetailProps['mode'], undefined>;
    withMenuCollapse: boolean;
    withFixedPos: boolean;
    withTransparentTabs: boolean;
    fixedPosHeaderAdjust: number;
    items: IMasterDetailOptionInternal[];
    onChange: (activeItem: string) => void;
}

export default IContentProps;

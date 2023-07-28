import { IMasterDetailOptionInternal } from '../../model/IMasterDetailOption';
import IMasterDetailProps from '../../model/IMasterDetailProps';

export interface IContentProps {
    children: React.ReactNode;
    loading: boolean;
    mode: Exclude<IMasterDetailProps['mode'], undefined>;
    withMenuCollapse: boolean;
    withFixedPos: boolean;
    fixedPosHeaderAdjust: number;
    items: IMasterDetailOptionInternal[];
    onChange: (activeItem: string) => void;
}

export default IContentProps;

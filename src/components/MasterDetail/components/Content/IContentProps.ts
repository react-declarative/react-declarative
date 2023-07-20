import { IMasterDetailOptionInternal } from '../../model/IMasterDetailOption';

export interface IContentProps {
    children: React.ReactNode;
    items: IMasterDetailOptionInternal[];
    onChange: (activeItem: string) => void;
}

export default IContentProps;

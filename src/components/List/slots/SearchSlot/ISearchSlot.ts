export interface ISearchSlot {
    className?: string;
    style?: React.CSSProperties;
    onSearchChange?: (search: string) => void;
    clean: () => void;
    loading: boolean;
    label: string;
    search: string;
    height: number;
    width: number;
}
  
export default ISearchSlot;

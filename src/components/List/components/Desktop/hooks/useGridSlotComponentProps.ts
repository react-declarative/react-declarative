import { useGridApiContext } from "@mui/x-data-grid";

export const useGridSlotComponentProps = () => {
    const apiRef = useGridApiContext();
    const { rootElementRef: rootElement, state } = apiRef.current;
    return { apiRef, state, rootElement };
};

export default useGridSlotComponentProps;

import useProps from './useProps';

export const useReload = () => {
    const { handleReload } = useProps();
    return (keepPagination?: boolean) => handleReload(keepPagination);
};

export default useReload;

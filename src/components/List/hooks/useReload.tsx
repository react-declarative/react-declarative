import useProps from './useProps';

export const useReload = () => {
    const { handleReload } = useProps();
    return () => handleReload();
};

export default useReload;

import useProps from './useProps';

export const useReload = () => {
    const { handleReload = () => null } = useProps();
    return () => handleReload();
};

export default useReload;

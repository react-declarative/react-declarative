import useProps from './useProps';

/**
 * A function that returns a callback function for reloading data.
 *
 * @function
 * @returns A callback function for reloading data.
 *
 */
export const useReload = () => {
    const { handleReload } = useProps();
    return (keepPagination?: boolean) => handleReload(keepPagination);
};

export default useReload;

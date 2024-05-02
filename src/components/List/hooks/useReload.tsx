import useProps from './useProps';

/**
 * A function that returns a callback function for reloading data.
 *
 * @function
 * @returns A callback function for reloading data.
 *
 */
export const useReload = () => {
    const { handleReload, computeKeepPageOnReload } = useProps();
    return async (keepPagination?: boolean) => {
        if (!computeKeepPageOnReload()) {
            return await handleReload(false);
        }
        return await handleReload(keepPagination)
    };
};

export default useReload;

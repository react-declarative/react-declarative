import useProps from './useProps';

/**
 * A function that returns a callback function to handle drop filters.
 *
 * @returns - The callback function to handle drop filters.
 */
export const useDropFilters = () => {
    const { handleFilter } = useProps();
    return () => handleFilter({});
};

export default useDropFilters;

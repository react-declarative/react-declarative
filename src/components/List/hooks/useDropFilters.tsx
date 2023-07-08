import useProps from './useProps';

export const useDropFilters = () => {
    const { handleFilter } = useProps();
    return () => handleFilter({});
};

export default useDropFilters;

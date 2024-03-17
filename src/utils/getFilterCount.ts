/**
 * Counts the number of non-empty and non-ignored values in the given filter data object.
 *
 * @param filterData - The filter data object.
 * @param ignore - The function to determine if a key-value pair should be ignored. It should accept
 *                            a key and a value, and return true if the pair should be ignored, or false otherwise.
 *                            Default value is a function that always returns false.
 * @returns - The count of non-empty and non-ignored values in the filter data object.
 */
export const getFilterCount = (filterData: Record<string, unknown>, ignore: (key: string, value: any) => boolean = () => false) => {
    const keys = Object.keys(filterData || {});
    let counter = 0;
    for (const key of keys) {
      if (filterData[key] === null) {
        continue
      } 
      if (filterData[key] === "") {
        continue
      }
      if (filterData[key] === false) {
        continue
      }
      if (ignore(key, filterData[key])) {
        continue
      }
      counter++;
    }
    return counter;
}

export default getFilterCount;

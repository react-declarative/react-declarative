export const compareFulltext = <T extends Record<string, any>>(data: T, search: string, ...keys: string[]) => {
  const target = String(search || "")
    .toLowerCase()
    .split(" ");
  const filterFn = (key: string) => {
    const source = String(data[key] || "")
      .toLowerCase()
      .split(" ");
    return target.every(function (term) {
      return source.some((word) => word.includes(term));
    });
  };
  let isOk = false;
  for (const key of keys) {
    isOk = isOk || filterFn(key);
  }
  return isOk;
};

export default compareFulltext;

export const pickDocuments = <T extends any>(
  limit: number,
  offset: number
) => {
  const result: T[] = [];
  return (rows: T[] = []) => {
    for (const row of rows) {
      if (offset > 0) {
        offset -= 1;
        continue;
      }
      if (limit > 0) {
        result.push(row);
        limit -= 1;
        continue;
      }
      break;
    }
    return {
      rows: result,
      done: limit <= 0,
    };
  };
};

export default pickDocuments;

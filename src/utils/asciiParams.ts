


export const parseAsciiParams = <T extends {} = Record<string, any>>(state: number[]): T | null => {
  try {
    const stringParams = state.map((char) => String.fromCharCode(char)).join('');
    return Object.fromEntries(
        stringParams
            .split(';')
            .map((line) => line.split('='))
            .map(([key, value]) => {
                if (value === "true") {
                    return [key, true];
                } else if (value === "false") {
                    return [key, false];
                } else if (value === "null") {
                    return [key, null];
                } else if (!Number.isNaN(parseFloat(value))) {
                    return [key, parseFloat(value)];
                } else {
                    return [key, value];
                }
            })
    );
  } catch {
    return null;
  }
};

export const serializeAsciiParams = <T extends {} = Record<string, any>>(state: T) => {
  const stringParams = Object.entries(state)
    .map(([key, value]) => `${key}=${value}`)
    .join(';');
  return [...stringParams].map((char) => char.charCodeAt(0));
};

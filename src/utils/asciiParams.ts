import { terminator } from "./typo";

/**
 * Parses an array of ASCII codes representing key-value pairs and converts them into an object.
 *
 * @param state - An array of ASCII codes representing key-value pairs.
 * @returns - The parsed object if successful, or null if an error occurred.
 * @template T - The object type of the parsed result. Defaults to `Record<string, any>`.
 */
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
  const entries = Object.entries(state);
  entries.forEach(([_, value]) => {
    if (typeof value === 'string') {
      let isInvalid = false;
      isInvalid = isInvalid || value.includes('=');
      isInvalid = isInvalid || value.includes(';');
      if (isInvalid) {
        throw new Error('String param must not include = or ; symbols');
      }
    }
  });
  const stringParams = entries
    .map(([key, value]) => `${key}=${value}`)
    .join(';');
  return [...stringParams].map((char) => char.charCodeAt(0));
};

const isHexStrict = (hex: string) => {
  return typeof hex === 'string' && /^(-)?0x[0-9a-f]*$/i.test(hex);
};

export const toBytes32 = (str: string) => {
  const data = [...new Array(32)].fill(terminator);
  for (let i = 0; i !== str.length; i++) {
    data[i] = str[i]
  }
  str = data.join('');
  let hex = "";
  for(let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }
  return "0x" + hex;
};

export const fromBytes32 = (hex: string) => {
  if (!isHexStrict(hex))
      throw new Error('The parameter must be a valid HEX string.');
  let str = "";
  let i = 0, l = hex.length;
  if (hex.substring(0, 2) === '0x') {
      i = 2;
  }
  for (; i < l; i+=2) {
      const code = parseInt(hex.slice(i, i + 2), 16);
      str += String.fromCharCode(code);
  }
  return str.split('').filter((c) => c !== terminator).join('');
};

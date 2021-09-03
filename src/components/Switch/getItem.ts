import { pathToRegexp } from "path-to-regexp";
import { Key } from "path-to-regexp";

import ISwitchCurrent from "./model/ISwitchCurrent";
import ISwitchItem from "./model/ISwitchItem";

interface IParams {
  items: ISwitchItem[];
  url?: string;
}

export const getItem = ({
  items,
  url = '',
}: IParams): ISwitchCurrent | null => {
  const keys: Key[] = [];
  let isOk = false;
  const route = items.reduce((acm: ISwitchItem, {
    component,
    path,
    guard = () => true,
  }) => {
    const params: Record<string, unknown> = {};
    const reg = pathToRegexp(path, keys)
    const match = reg.test(url);
    if (match && guard()) {
      const tokens = reg.exec(url);
      tokens && keys.forEach((key, i) => {
        params[key.name] = tokens[i + 1]
      });
      isOk = true;
      return {
        component,
        path,
        params,
      };
    }
    return acm;
  }, null as unknown as ISwitchCurrent);
  return isOk ? (route as unknown as ISwitchCurrent) : null;
};

export default getItem;

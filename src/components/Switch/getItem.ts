import { Fragment } from "react";

import { pathToRegexp } from "path-to-regexp";
import { Key } from "path-to-regexp";

import ISwitchItem from "./model/ISwitchItem";
import ISwitchState from "./model/ISwitchState";

interface IParams {
  items: ISwitchItem[];
  url?: string;
}

export const getItem = ({
  items,
  url = '',
}: IParams): ISwitchState | null => {
  const keys: Key[] = [];
  let isOk = false;
  const route = items.reduce((acm: ISwitchItem, {
    component = Fragment,
    redirect,
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
        redirect,
        path,
        params,
      };
    }
    return acm;
  }, null as unknown as ISwitchItem);
  return isOk ? (route as unknown as ISwitchState) : null;
};

export default getItem;

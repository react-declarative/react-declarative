import { Fragment } from "react";

import { pathToRegexp } from "path-to-regexp";
import { Key } from "path-to-regexp";

import ISwitchItem from "./model/ISwitchItem";
import ISwitchState from "./model/ISwitchState";

import randomString from "../../utils/randomString";

interface IParams {
  items: ISwitchItem[];
  url?: string;
  key?: string;
}

export const getItem = async ({
  items,
  url = '',
  key = randomString(),
}: IParams): Promise<ISwitchState | null> => {
  const keys: Key[] = [];
  let result: ISwitchState | null = null;
  for (const { component = Fragment, redirect, path, guard = () => true } of items) {
    const params: Record<string, unknown> = {};
    const reg = pathToRegexp(path, keys)
    const match = reg.test(url);
    if (match) {
      let canActivate: boolean | Promise<boolean> = guard();
      canActivate = (canActivate as unknown) instanceof Promise ? (await canActivate) : canActivate;
      if (canActivate) {
        const tokens = reg.exec(url);
        tokens && keys.forEach((key, i) => {
          params[key.name] = tokens[i + 1]
        });
        result = {
          component,
          redirect,
          params,
          key,
        };
      }
    }
  }
  return result;
};

export default getItem;

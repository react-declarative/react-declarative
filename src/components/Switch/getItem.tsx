import * as React from 'react';

import { Fragment, ComponentType } from "react";

import { pathToRegexp } from "path-to-regexp";
import { Key } from "path-to-regexp";

import ISwitchItem from "./model/ISwitchItem";
import ISwitchState from "./model/ISwitchState";

import randomString from "../../utils/randomString";

interface IParams {
  items: ISwitchItem[];
  url?: string;
  key?: string;
  onLoading?: () => void;
  Forbidden?: ComponentType<any>;
}

export const getItem = async ({
  items,
  url = '',
  key = randomString(),
  onLoading = () => null,
  Forbidden = () => <Fragment />,
}: IParams): Promise<ISwitchState | null> => {
  let result: ISwitchState | null = null;
  for (const { element = () => <Fragment />, redirect, path, guard = () => true } of items) {
    const params: Record<string, unknown> = {};
    const keys: Key[] = [];
    const reg = pathToRegexp(path, keys);
    const match = reg.test(url);
    if (match) {
      let canActivate: boolean | Promise<boolean> = guard();
      if (canActivate instanceof Promise) {
        onLoading();
        canActivate = await canActivate;
      }
      if (canActivate) {
        const tokens = reg.exec(url);
        tokens && keys.forEach((key, i) => {
          params[key.name] = tokens[i + 1];
        });
        result = {
          element,
          redirect,
          params,
          key,
        };
      } else {
        result = {
          element: Forbidden,
          params: {},
          key,
        };
      }
    }
  }
  return result;
};

export default getItem;

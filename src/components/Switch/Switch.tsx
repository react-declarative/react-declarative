import * as React from 'react';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createElement } from 'react';

import { Fragment } from 'react';

import { Update } from 'history';
import { createBrowserHistory } from 'history';

import ISwitchItem from './model/ISwitchItem';
import ISwitchState from './model/ISwitchState';
import ISwitchProps from './model/ISwitchProps';

import randomString from '../../utils/randomString';

import ForbiddenDefault from './Forbidden';
import NotFoundDefault from './NotFound';
import LoadingDefault from './Loading';

import getItem from './getItem';

const defaultHistory = createBrowserHistory();

export const Switch = ({
  items = [],
  fallback = () => null,
  history = defaultHistory,
  Forbidden = ForbiddenDefault,
  NotFound = NotFoundDefault,
  Loading = LoadingDefault,
}: ISwitchProps) => {

  const [state, setState] = useState<ISwitchState>(null as never);
  const [loading, setLoading] = useState(false);

  const {
    element = () => <Fragment />,
    params,
    key,
  } = useMemo(() => state || {}, [state]);

  const handleItem = useCallback(async (items: ISwitchItem[], url: string, key = url) => {
    let result: ISwitchState | null = null;
    try {
      result = await getItem({
        items,
        url,
        key,
        Forbidden,
        onLoading: () => setLoading(true),
      });
    } catch (e) {
      fallback(e as Error);
    } finally {
      setLoading(false);
      return result;
    }
  }, [fallback]);

  const handleNavigate = useCallback(async ({
    location,
  }: Update) => {
    const { pathname: url, key = randomString() } = location;
    const item = await handleItem(items, url, key);
    if (item) {
      if (item.redirect) {
        history.push(item.redirect);
      } else {
        setState(item);
      }
    } else {
      setState({
        element: NotFound,
        params: {},
        key,
      });
    }
  }, [state]);

  useEffect(() => {
    const unsubscribe = history.listen(handleNavigate);
    handleNavigate(history);
    return () => unsubscribe();
  }, [history]);

  if (loading) {
    return createElement(Loading);
  } else {
    return createElement(element, {
      ...params,
      key,
    });
  }
};

export default Switch;

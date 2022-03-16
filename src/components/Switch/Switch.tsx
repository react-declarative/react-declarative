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

const LOADING_APPEAR_DELAY_DEFAULT = 1_000;

export const Switch = ({
  items = [],
  fallback = () => null,
  history = defaultHistory,
  Forbidden = ForbiddenDefault,
  NotFound = NotFoundDefault,
  Loading = LoadingDefault,
  loadingAppearDelay = LOADING_APPEAR_DELAY_DEFAULT,
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
    const loaderWillAppear = setTimeout(() => setLoading(true), loadingAppearDelay);
    try {
      result = await getItem({ items, url, key, Forbidden });
    } catch (e) {
      fallback(e as Error);
    } finally {
      clearTimeout(loaderWillAppear);
      setLoading(false);
      return result;
    }
  }, [fallback, loadingAppearDelay]);

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

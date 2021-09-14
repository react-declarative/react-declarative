import { useState, useEffect, useCallback, useMemo } from 'react';
import { createElement } from 'react';

import { Fragment } from 'react';

import { Update } from 'history';
import { createBrowserHistory } from 'history';

import ISwitchState from './model/ISwitchState';
import ISwitchProps from './model/ISwitchProps';

import randomString from '../../utils/randomString';

import NotFoundDefault from './NotFound';
import LoadingDefault from './Loading';

import getItem from './getItem';
import ISwitchItem from './model/ISwitchItem';

const defaultHistory = createBrowserHistory();

export const Switch = ({
  items = [],
  fallback = () => null,
  history = defaultHistory,
  NotFound = NotFoundDefault,
  Loading = LoadingDefault,
}: ISwitchProps) => {

  const [state, setState] = useState<ISwitchState>(null as never);
  const [loading, setLoading] = useState(false);

  const {
    component = Fragment,
    params,
    key,
  } = useMemo(() => state || {}, [state]);

  const handleItem = useCallback(async (items: ISwitchItem[], url: string, key: string) => {
    let result: ISwitchState | null = null;
    try {
      setLoading(true);
      result = await getItem({ items, url, key });
    } catch (e) {
      fallback(e as Error);
    } finally {
      setLoading(false);
      return result;
    }
  }, [fallback]);

  useEffect(() => {
    const handler = async ({
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
          component: NotFound,
          params: {},
          key,
        });
      }
    };
    const unsubscribe = history.listen(handler);
    handler(history);
    return () => unsubscribe();
  }, [history]);

  if (loading) {
    return createElement(Loading);
  } else {
    return createElement(component, {
      ...params,
      key,
    });
  }
};

export default Switch;

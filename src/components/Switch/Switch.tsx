import { useState, useEffect, useMemo } from 'react';
import { createElement } from 'react';

import { Fragment } from 'react';

import { Update } from 'history';
import { createBrowserHistory } from 'history';

import ISwitchState from './model/ISwitchState';
import ISwitchProps from './model/ISwitchProps';

import randomString from '../../utils/randomString';

import NotFoundDefault from './NotFound';

import getItem from './getItem';

const defaultHistory = createBrowserHistory();

export const Switch = ({
  items = [],
  history = defaultHistory,
  NotFound = NotFoundDefault,
}: ISwitchProps) => {

  const [state, setState] = useState<ISwitchState>(null as never);

  const {
    component = Fragment,
    params,
    key,
  } = useMemo(() => state || {}, [state]);

  useEffect(() => {
    const handler = ({
      location,
    }: Update) => {
      const { pathname: url, key = randomString() } = location;
      const item = getItem({ items, url });
      if (item) {
        if (item.redirect) {
          history.push(item.redirect);
        } else {
          setState({ ...item, key });
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

  return createElement(component, {
    ...params,
    key,
  });
};

export default Switch;

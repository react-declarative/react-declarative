import { useState, useEffect } from 'react';
import { createElement } from 'react';

import { Fragment } from 'react';

import { Update } from 'history';
import { createBrowserHistory } from 'history';

import ISwitchState from './model/ISwitchState';
import ISwitchProps from './model/ISwitchProps';

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
  } = state || {};

  useEffect(() => {
    const handler = ({
      location,
    }: Update) => {
      const { pathname: url } = location;
      const item = getItem({ items, url, });
      if (item) {
        item.redirect && history.push(item.redirect);
        setState(item);
      } else {
        setState({
          component: NotFound,
          params: {},
        });
      }
    };
    const unsubscribe = history.listen(handler);
    handler(history);
    return () => unsubscribe();
  }, [history]);

  return createElement(component, params);
};

export default Switch;

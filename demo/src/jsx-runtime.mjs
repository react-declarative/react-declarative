import React from "react";

const factory = (type, props) => {
  if (window.Translate) {
    return window.Translate.jss(type, props);
  }
  return React.createElement(type, props);
};

const { Fragment } = React;

export { Fragment, factory as jsx, factory as jsxs };

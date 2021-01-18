import React, { Fragment, useState } from 'react'

import { Container, CssBaseline, makeStyles } from '@material-ui/core';

import { One, FieldType, IField } from 'react-view-builder';

import Router from './Router';

const fields: IField[] = [
  {
    type: FieldType.Combo,
    name: 'route',
    itemList: [
      'layout-page',
      'validation-page',
      'gallery-page',
    ],
    outlined: false,
    columns: '4',
    tr(item) {
      if (item === 'layout-page') {
        return 'Layout grid';
      } else if (item === 'validation-page') {
        return 'Form validation';
      } else if (item === 'gallery-page') {
        return 'Gallery of controls';
      } else {
        return '';
      }
    },
    defaultValue: 'layout-page',
  },
];

const useStyles = makeStyles({
  offset: {
    padding: '15px',
  },
});

const App = () => {
  const [route, setRoute] = useState('');
  const classes = useStyles();
  return (
    <Fragment>
      <CssBaseline/>
      <div className={classes.offset}>
        <One fields={fields} change={({route}) => setRoute(route)} />
      </div>
      <Container className={classes.offset}>
        <Router route={route} />
      </Container>
    </Fragment>
  )
};

export default App;

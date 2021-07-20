import * as React from 'react';
import { useState } from 'react';

import { Scaffold, IMenuGroup } from 'react-view-builder';

import Router from './Router';

const options: IMenuGroup[] = [
  {
    label: 'Use cases',
    icon: 'dot',
    options: [
      {
        name: "layout-page",
        label: 'Layout grid',
      },
      {
        name: "validation-page",
        label: 'Form validation',
      },
      {
        name: "gallery-page",
        label: 'Gallery of controls',
      },
      {
        name: "sample-page",
        label: 'Example page',
      },
      {
        name: "hero-page",
        label: 'Hero page',
      },
      {
        name: "list-page",
        label: 'List page',
      },
    ],
  },
];

const App = () => {
  const [route, setRoute] = useState('');

  const handleOptionClick = (name: string) => setRoute(name);

  return (
    <Scaffold
      title="Scaffold"
      selected={route}
      options={options}
      onOptionClick={handleOptionClick}
    >
      <Router route={route} />
    </Scaffold>
  );
};

export default App;

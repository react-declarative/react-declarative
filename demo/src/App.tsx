import React from 'react';

import { Scaffold, Switch, IMenuGroup, ISwitchItem, IScaffoldOption } from 'react-declarative';

import SamplePage from './pages/SamplePage';
import LayoutGrid from './pages/LayoutPage';
import GalleryPage from './pages/GalleryPage';
import ValidationPage from './pages/ValidationPage';
import LoginPage from './pages/LoginPage';
import HeroPage from './pages/HeroPage';
import ListPage from './pages/ListPage';
import FadePage from './pages/FadePage';
import RevealPage from './pages/RevealPage';
import MvvmPage from './pages/MvvmPage';

import history from './history';

import sleep from './utils/sleep';

const options: IMenuGroup[] = [
  {
    label: 'Use cases',
    lifted: true,
    options: [
      {
        name: "layout-page",
        label: 'Layout grid',
        isVisible: async () => {
          await sleep(5_000);
          return true;
        },
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
      {
        name: "fade-page",
        label: 'Fade page',
      },
      {
        name: "reveal-page",
        label: 'Reveal page',
      },
      {
        name: "mvvm-page",
        label: 'Mvvm page',
      },
      {
        label: 'Use cases',
        options: [
          {
            name: "test-page",
            label: 'Test page',
          },
        ]
      },
    ],
  },
];



const routes: ISwitchItem[] = [
  {
    path: '/',
    redirect: '/layout-page',
  },
  {
    path: '/layout-page',
    element: () => <LayoutGrid />,
  },
  {
    path: '/validation-page',
    element: () => <ValidationPage />,
  },
  {
    path: '/gallery-page',
    element: () => <GalleryPage />,
  },
  {
    path: '/sample-page',
    element: () => <SamplePage />,
  },
  {
    path: '/login-page',
    element: () => <LoginPage />,
  },
  {
    path: '/hero-page',
    element: () => <HeroPage />,
  },
  {
    path: '/list-page',
    element: () => <ListPage />,
  },
  {
    path: '/fade-page',
    guard: async () => {
      await sleep(1_000);
      return true;
    },
    element: () => <FadePage />,
  },
  {
    path: '/list-page',
    element: () => <ListPage />,
  },
  {
    path: '/reveal-page',
    element: () => <RevealPage />,
  },
  {
    path: '/mvvm-page',
    element: () => <MvvmPage />,
  }
];

const actions: IScaffoldOption[] = [
  {
    action: 'export-action',
    label: 'Export data',
  },
];

const App = () => {

  const handleOptionClick = (path: string) => history.push(`/${path}`);

  return (
    <Scaffold
      dense
      title="Scaffold"
      options={options}
      actions={actions}
      onOptionClick={handleOptionClick}
    >
      <Switch
        Loader={() => <p>Checking permissions (mock)</p>}
        NotFound={() => <p>Not found(</p>}
        history={history}
        items={routes}
      />
    </Scaffold>
  );
};

export default App;

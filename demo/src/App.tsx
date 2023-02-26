import React from 'react';

import { Scaffold2, Switch, IScaffold2Group, ISwitchItem, IScaffoldOption, SecretView } from 'react-declarative';

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

import PeopleIcon from '@mui/icons-material/People';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual';
import PublicIcon from '@mui/icons-material/Public';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';

import history from './history';

import sleep from './utils/sleep';

const options: IScaffold2Group[] = [
  {
    id: 'Build',
    children: [
      {
        id: 'Authentication',
        icon: PeopleIcon,
        tabs: [
          {
            id: 'tab1',
            label: 'Tab1',
          },
          {
            id: 'tab2',
            label: 'Tab2',
          },
        ],
      },
      { id: 'Database', icon: DnsRoundedIcon, },
      { id: 'Storage', icon: PermMediaOutlinedIcon, },
      { id: 'Hosting', icon: PublicIcon, },
      { id: 'Functions', icon: SettingsEthernetIcon, },
      {
        id: 'Machine learning',
        icon: SettingsInputComponentIcon,
      },
    ],
    
  },
  {
    id: 'Quality',
    children: [
      { id: 'Analytics', icon: SettingsIcon, },
      { id: 'Performance', icon: TimerIcon, },
      { id: 'Test Lab', icon: PhonelinkSetupIcon, },
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
    <SecretView enabled={false} onCode={console.log}>
      <Scaffold2
        activeOption="Authentication"
        appName="Scaffold"
        options={options}
        actions={actions}
        onOptionClick={handleOptionClick}
        AfterMenuContent={() => <p>123</p>}
      >
        <Switch
          Loader={() => <p>Checking permissions (mock)</p>}
          NotFound={() => <p>Not found(</p>}
          history={history}
          items={routes}
        />
      </Scaffold2>
    </SecretView>
  );
};

export default App;

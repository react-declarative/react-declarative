import { createContext } from 'react';

import CheckBox from './components/CheckBox';
import Combo from './components/Combo';
import Items from './components/Items';
import Line from './components/Line';
import Radio from './components/Radio';
import Progress from './components/Progress';
import Rating from './components/Rating';
import Typography from './components/Typography';
import Text from './components/Text';
import Switch from './components/Switch';
import Slider from './components/Slider';

import ISlotFactoryContext from './ISlotFactoryContext';

export const defaultSlots = {
    CheckBox,
    Combo,
    Items,
    Line,
    Radio,
    Rating,
    Progress,
    Typography,
    Text,
    Switch,
    Slider,
};

export const SlotContext = createContext<ISlotFactoryContext>(defaultSlots);

export default SlotContext;

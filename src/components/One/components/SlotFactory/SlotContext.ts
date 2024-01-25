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
import Date from './components/Date';
import Time from './components/Time';
import Switch from './components/Switch';
import Slider from './components/Slider';
import File from './components/File';
import Choose from './components/Choose';
import Complete from './components/Complete';
import YesNo from './components/YesNo';
import Dict from './components/Dict';

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
    Date,
    Time,
    Switch,
    Slider,
    File,
    Choose,
    Complete,
    YesNo,
    Dict,
};

export const SlotContext = createContext<ISlotFactoryContext>(defaultSlots);

export default SlotContext;

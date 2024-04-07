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
import Tree from './components/Tree';

import ISlotFactoryContext from './ISlotFactoryContext';

/**
 * @description A list of default slots for a component.
 * @type {Array}
 * @property Checkbox Slot for a checkbox component.
 * @property Combo Slot for a comboBox component.
 * @property Items Slot for an items component.
 * @property Line Slot for a line component.
 * @property Radio Slot for a radio component.
 * @property Rating Slot for a rating component.
 * @property Progress Slot for a progress component.
 * @property Typography Slot for a typography component.
 * @property Text Slot for a text component.
 * @property Date Slot for a date component.
 * @property Time Slot for a time component.
 * @property Switch Slot for a switch component.
 * @property Slider Slot for a slider component.
 * @property File Slot for a file component.
 * @property Choose Slot for a choose component.
 * @property Complete Slot for a complete component.
 * @property YesNo Slot for a yes/no component.
 * @property Dict Slot for a dictionary component.
 * @property Tree Slot for a tree component.
 */
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
    Tree,
};

export const SlotContext = createContext<ISlotFactoryContext>(defaultSlots);

export default SlotContext;

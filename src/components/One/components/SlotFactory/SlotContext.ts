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
 * @property {string} Checkbox Slot for a checkbox component.
 * @property {string} Combo Slot for a comboBox component.
 * @property {string} Items Slot for an items component.
 * @property {string} Line Slot for a line component.
 * @property {string} Radio Slot for a radio component.
 * @property {string} Rating Slot for a rating component.
 * @property {string} Progress Slot for a progress component.
 * @property {string} Typography Slot for a typography component.
 * @property {string} Text Slot for a text component.
 * @property {string} Date Slot for a date component.
 * @property {string} Time Slot for a time component.
 * @property {string} Switch Slot for a switch component.
 * @property {string} Slider Slot for a slider component.
 * @property {string} File Slot for a file component.
 * @property {string} Choose Slot for a choose component.
 * @property {string} Complete Slot for a complete component.
 * @property {string} YesNo Slot for a yes/no component.
 * @property {string} Dict Slot for a dictionary component.
 * @property {string} Tree Slot for a tree component.
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

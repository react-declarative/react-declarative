import { ComponentType } from 'react';

import { IProgressSlot } from '../../slots/ProgressSlot';
import { ICheckBoxSlot } from '../../slots/CheckBoxSlot';
import { IItemsSlot } from '../../slots/ItemsSlot';
import { IComboSlot } from '../../slots/ComboSlot';
import { ILineSlot } from '../../slots/LineSlot';
import { IRadioSlot } from '../../slots/RadioSlot';
import { IRatingSlot } from '../../slots/RatingSlot';
import { ITypographySlot } from '../../slots/TypographySlot';
import { ITextSlot } from '../../slots/TextSlot';
import { IDateSlot } from '../../slots/DateSlot';
import { ITimeSlot } from '../../slots/TimeSlot';
import { ISwitchSlot } from '../../slots/SwitchSlot';
import { ISliderSlot } from '../../slots/SliderSlot';
import { IFileSlot } from '../../slots/FileSlot/IFileSlot';
import { IChooseSlot } from '../../slots/ChooseSlot';
import { ICompleteSlot } from '../../slots/CompleteSlot';
import { IYesNoSlot } from '../../slots/YesNoSlot';
import { IDictSlot } from '../../slots/DictSlot';
import { ITreeSlot } from '../../slots/TreeSlot';

/**
 * A context object that provides access to various component types used by the slot factory.
 * @typedef ISlotFactoryContext
 * @property CheckBox - The component type for Checkbox slots.
 * @property Combo - The component type for Combo slots.
 * @property YesNo - The component type for YesNo slots.
 * @property Items - The component type for Items slots.
 * @property Line - The component type for Line slots.
 * @property Progress - The component type for Progress slots.
 * @property Radio - The component type for Radio slots.
 * @property Rating - The component type for Rating slots.
 * @property Typography - The component type for Typography slots.
 * @property Text - The component type for Text slots.
 * @property Date - The component type for Date slots.
 * @property Time - The component type for Time slots.
 * @property Switch - The component type for Switch slots.
 * @property Slider - The component type for Slider slots.
 * @property File - The component type for File slots.
 * @property Choose - The component type for Choose slots.
 * @property Complete - The component type for Complete slots.
 * @property Dict - The component type for Dict slots.
 * @property Tree - The component type for Tree slots.
 */
export interface ISlotFactoryContext {
    CheckBox: ComponentType<ICheckBoxSlot>;
    Combo: ComponentType<IComboSlot>;
    YesNo: ComponentType<IYesNoSlot>;
    Items: ComponentType<IItemsSlot>;
    Line: ComponentType<ILineSlot>;
    Progress: ComponentType<IProgressSlot>;
    Radio: ComponentType<IRadioSlot>;
    Rating: ComponentType<IRatingSlot>;
    Typography: ComponentType<ITypographySlot>;
    Text: ComponentType<ITextSlot>;
    Date: ComponentType<IDateSlot>;
    Time: ComponentType<ITimeSlot>;
    Switch: ComponentType<ISwitchSlot>;
    Slider: ComponentType<ISliderSlot>;
    File: ComponentType<IFileSlot>;
    Choose: ComponentType<IChooseSlot>;
    Complete: ComponentType<ICompleteSlot>;
    Dict: ComponentType<IDictSlot>;
    Tree: ComponentType<ITreeSlot>;
}

export default ISlotFactoryContext;

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
 * @typedef {Object} ISlotFactoryContext
 * @property {ComponentType<ICheckBoxSlot>} CheckBox - The component type for Checkbox slots.
 * @property {ComponentType<IComboSlot>} Combo - The component type for Combo slots.
 * @property {ComponentType<IYesNoSlot>} YesNo - The component type for YesNo slots.
 * @property {ComponentType<IItemsSlot>} Items - The component type for Items slots.
 * @property {ComponentType<ILineSlot>} Line - The component type for Line slots.
 * @property {ComponentType<IProgressSlot>} Progress - The component type for Progress slots.
 * @property {ComponentType<IRadioSlot>} Radio - The component type for Radio slots.
 * @property {ComponentType<IRatingSlot>} Rating - The component type for Rating slots.
 * @property {ComponentType<ITypographySlot>} Typography - The component type for Typography slots.
 * @property {ComponentType<ITextSlot>} Text - The component type for Text slots.
 * @property {ComponentType<IDateSlot>} Date - The component type for Date slots.
 * @property {ComponentType<ITimeSlot>} Time - The component type for Time slots.
 * @property {ComponentType<ISwitchSlot>} Switch - The component type for Switch slots.
 * @property {ComponentType<ISliderSlot>} Slider - The component type for Slider slots.
 * @property {ComponentType<IFileSlot>} File - The component type for File slots.
 * @property {ComponentType<IChooseSlot>} Choose - The component type for Choose slots.
 * @property {ComponentType<ICompleteSlot>} Complete - The component type for Complete slots.
 * @property {ComponentType<IDictSlot>} Dict - The component type for Dict slots.
 * @property {ComponentType<ITreeSlot>} Tree - The component type for Tree slots.
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

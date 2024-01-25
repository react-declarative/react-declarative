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
}

export default ISlotFactoryContext;

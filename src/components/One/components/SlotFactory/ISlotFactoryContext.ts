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
import { ISwitchSlot } from '../../slots/SwitchSlot';
import { ISliderSlot } from '../../slots/SliderSlot';

export interface ISlotFactoryContext {
    CheckBox: ComponentType<ICheckBoxSlot>;
    Combo: ComponentType<IComboSlot>;
    Items: ComponentType<IItemsSlot>;
    Line: ComponentType<ILineSlot>;
    Progress: ComponentType<IProgressSlot>;
    Radio: ComponentType<IRadioSlot>;
    Rating: ComponentType<IRatingSlot>;
    Typography: ComponentType<ITypographySlot>;
    Text: ComponentType<ITextSlot>;
    Switch: ComponentType<ISwitchSlot>;
    Slider: ComponentType<ISliderSlot>;
}

export default ISlotFactoryContext;

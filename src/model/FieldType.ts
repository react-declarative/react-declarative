/**
 * Represents the type of a field in a <One /> component.
 */
export enum FieldType {
    Layout = 'custom-layout',
    Switch = 'switch-field',
    YesNo = 'yesno-field',
    Line = 'line-field',
    File = 'file-field',
    Group = 'group-layout',
    Paper = 'paper-layout',
    Outline = 'outline-layout',
    Expansion= 'expansion-layout',
    Radio = 'radio-field',
    Checkbox = 'checkbox-field',
    Text = 'text-field',
    Date = 'date-field',
    Time = 'time-field',
    Progress = 'progress-field',
    Component = 'component-field',
    Slider = 'slider-field',
    Combo = 'combo-field',
    Choose = 'choose-field',
    Tree = 'tree-field',
    Dict = 'dict-field',
    Init = 'init-field',
    Phony = 'phony-field',
    Button = 'button-field',
    Icon = 'icon-field',
    Complete = 'complete-field',
    Items = 'items-field',
    Rating = 'rating-field',
    Typography = 'typography-field',
    Fragment = 'fragment-layout',
    Div = 'div-layout',
    Box = 'box-layout',
    Tabs = 'tabs-layout',
    Hero = 'hero-layout',
    Center = 'center-layout',
    Stretch = 'stretch-layout',
    Condition = 'condition-layout',
};

Object.entries(FieldType).forEach(([key, value]) => {
    // @ts-ignore
    FieldType[key] = Symbol.for(value) as unknown as string;
});

export default FieldType;

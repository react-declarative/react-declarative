import IAnything from "./IAnything";
import IField from "./IField";

import IOneProps from "./IOneProps";

export interface IOnePublicProps<Data = IAnything, Payload = IAnything, Field = IField<Data>>
    extends Omit<IOneProps<Data, Payload, Field>, keyof {
        features: never;
    }> {
    onFocus?: IOneProps<Data, Field>['focus'];
    onBlur?: IOneProps<Data, Field>['blur'];
    onReady?: IOneProps<Data, Field>['ready'];
    onChange?: IOneProps<Data, Field>['change'];
    onInvalid?: IOneProps<Data, Field>['invalidity'];
    onLoadStart?: IOneProps<Data, Field>['loadStart'];
    onLoadEnd?: IOneProps<Data, Field>['loadEnd'];
    features?: string[] | (() => Record<string, boolean>);
};

export default IOnePublicProps;

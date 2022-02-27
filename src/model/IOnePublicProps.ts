import IAnything from "./IAnything";
import IField from "./IField";

import IOneProps from "./IOneProps";

export interface IOnePublicProps<Data = IAnything, Field = IField<Data>>
    extends IOneProps<Data, Field> {
    onFocus?: IOneProps<Data, Field>['focus'];
    onBlur?: IOneProps<Data, Field>['blur'];
    onReady?: IOneProps<Data, Field>['ready'];
    onChange?: IOneProps<Data, Field>['change'];
    onInvalid?: IOneProps<Data, Field>['invalidity'];
};

export default IOnePublicProps;

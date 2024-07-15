export interface ICord {
    type: 'rect' | 'square' | 'roi';
    color: string;
    id: string;
    top: number;
    left: number;
    width: number;
    height: number;
    label: string;
};

export interface ICordInternal extends Omit<ICord, keyof {
    color: never;
    label: never;
}> { }

export default ICord;

export interface ICord {
    type: 'rect' | 'square' | 'roi',
    color: string,
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
};

export interface ICordInternal extends Omit<ICord, keyof {
    color: never;
}> { }

export default ICord;

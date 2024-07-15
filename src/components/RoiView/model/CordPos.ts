import { rect, roi, square } from '../js/area-selector';

export type RectPos = ReturnType<typeof rect>;
export type RoiPos = ReturnType<typeof roi>;
export type SquarePos = ReturnType<typeof square>;

export type CordPos = RectPos | RoiPos | SquarePos;

export default CordPos;

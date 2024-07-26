import { rect, roi } from '../js/area-selector';

export type RectPos = ReturnType<typeof rect>;
export type RoiPos = ReturnType<typeof roi>;

export type CordPos = RectPos | RoiPos;

export default CordPos;

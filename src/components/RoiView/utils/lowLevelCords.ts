import { rect, roi, square } from "../js/area-selector";

import ICord from "../model/ICord";

export const lowLevelCords = (cords: ICord[], naturalHeight = 100, naturalWidth = 100) => cords.map(({
    id, type, height, width, top, left, color, label, angle
}) => type === 'rect' ? rect(id, top, left, height, width, angle, color, label)
        : type === 'square' ? square(id, top, left, Math.max(height, width), angle, color, label)
            : type === 'roi' ? roi(top, left, naturalWidth - left - width, naturalHeight - top - height, color)
                : console.error('lowLevelCords invalid cord type', type) as never
);

export default lowLevelCords;

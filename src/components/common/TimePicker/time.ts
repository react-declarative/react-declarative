
export const HOURS = 'hours';
export const MINUTES = 'minutes';

/**
 * Represents the center point of a coordinate system.
 *
 * @typedef {Object} Center
 * @property x - The x-coordinate of the center point.
 * @property y - The y-coordinate of the center point.
 */
const center = {
  x: 260 / 2,
  y: 260 / 2,
};

/**
 * Represents a base point with x and y coordinates.
 *
 * @typedef {Object} BasePoint
 * @property x - The x coordinate of the base point.
 * @property y - The y coordinate of the base point.
 */
const basePoint = {
  x: center.x,
  y: 0,
};

const cx = basePoint.x - center.x;
const cy = basePoint.y - center.y;

/**
 * Convert radians to degrees.
 * @param rad - The value in radians.
 * @returns - The converted value in degrees.
 */
const rad2deg = (rad: number) => rad * 57.29577951308232;

/**
 * Calculates the angle value based on the given step, offsetX, and offsetY.
 *
 * @param step - The step value.
 * @param offsetX - The x-coordinate offset.
 * @param offsetY - The y-coordinate offset.
 * @returns The calculated angle value.
 */
const getAngleValue = (step: number, offsetX: number, offsetY: number) => {
  const x = offsetX - center.x;
  const y = offsetY - center.y;

  const atan = Math.atan2(cx, cy) - Math.atan2(x, y);

  let deg = rad2deg(atan);
  deg = Math.round(deg / step) * step;
  deg %= 360;

  const value = Math.floor(deg / step) || 0;

  return value;
};

/**
 * Calculates the hour of the clock based on the given offsetX and offsetY coordinates.
 * The value is calculated by using the getAngleValue function, and if it returns a falsy value,
 * 12 is used as the default value.
 * The hour is then converted to a value between 0 and 11 using the modulo operator.
 *
 * @param offsetX - The X coordinate offset.
 * @param offsetY - The Y coordinate offset.
 * @returns - The hour value between 0 and 11.
 */
export const getHours = (offsetX: number, offsetY: number) => {
  const value = getAngleValue(30, offsetX, offsetY) || 12;

  return value % 12;
};

/**
 * Calculates the number of minutes based on the provided coordinates offset and step.
 *
 * @param offsetX - The horizontal offset in pixels.
 * @param offsetY - The vertical offset in pixels.
 * @param [step=6] - The step size in degrees (default: 6).
 * @returns The number of minutes.
 */
export const getMinutes = (offsetX: number, offsetY: number, step = 6) => {
  const value = getAngleValue(step, offsetX, offsetY);
  return value;
};

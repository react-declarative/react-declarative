import { v4 as uuid } from 'uuid';

/**
 * Generates a random string using the UUID library.
 *
 * @returns {string} A randomly generated string.
 */
export const randomString = () => uuid();

export default randomString;

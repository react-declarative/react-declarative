import { useTheme } from '@mui/material/styles';

import { createMakeAndWithStyles, keyframes } from 'tss-react';

/**
 * @typedef Styles - The makeStyles function returns an object with CSS styles.
 * @property root - The root property holds the CSS styles for the root element.
 * @property header - The header property holds the CSS styles for the header element.
 * @property content - The content property holds the CSS styles for the content element.
 * @property button - The button property holds the CSS styles for the button element.
 * @property text - The text property holds the CSS styles for the text element.
 *
 * @param theme - The theme object that contains the global theme settings.
 * @returns An object that contains CSS styles for specific elements.
 *
 * @description
 * The makeStyles function is a utility function that creates and returns an object of CSS styles using the Material-UI makeStyles hook.
 * It takes a theme object as an argument to allow customization based on the global theme settings.
 * The returned styles object has properties for different elements to be styled, such as root, header, content, button, and text.
 * These properties hold objects that define the specific CSS styles for the corresponding elements.
 * These styles can be overridden and customized by providing a custom theme object.
 *
 * Example usage:
 * const theme = {
 *   palette: {
 *     primary: {
 *       main: '#F44336',
 *       contrastText: '#fff',
 *     },
 *     secondary: {
 *       main: '#3F51B5',
 *       contrastText: '#fff',
 *     },
 *   },
 *   typography: {
 *     fontSize: 16,
 *     fontFamily: 'Roboto',
 *   },
 * };
 *
 * const styles = makeStyles(theme);
 *
 * const classes = styles(); // Get the CSS classes object
 *
 * console.log(classes.root); // { background: '#F44336', color: '#fff' }
 */
export const { makeStyles } = createMakeAndWithStyles({
  useTheme,
});

export { useTheme, keyframes };

export default makeStyles;

/**
 * Sets the main color theme of the application.
 * @param color - The color to set as the main theme color.
 */
export const mainColor = (color: string) => {
    document.head.innerHTML += (`
        <meta name="theme-color" content="${color}">
        <style>
            html {
                background: ${color} !important;
            }
        </style>
    `);
};

export default mainColor;

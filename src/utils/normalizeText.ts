import IField from "../model/IField";
import formatText from "./formatText";

/**
 * Represents the configuration options for input formatting.
 * @interface
 */
interface IConfig {
  inputFormatterSymbol: IField["inputFormatterSymbol"];
  inputFormatterAllowed: IField["inputFormatterAllowed"];
  inputFormatterReplace: IField["inputFormatterReplace"];
  inputFormatterTemplate: IField["inputFormatterTemplate"];
  inputFormatter: IField["inputFormatter"];
}

/**
 * Normalize text by applying inputFormatter function to each character.
 *
 * @param text - The input text to normalize.
 * @param config - The configuration object.
 * @param [config.inputFormatterSymbol='0'] - The symbol used in input formatter.
 * @param [config.inputFormatterAllowed] - The list of allowed characters in input formatter.
 * @param [config.inputFormatterReplace] - The mapping of characters to be replaced in input formatter.
 * @param [config.inputFormatterTemplate=''] - The template used in input formatter.
 * @param [config.inputFormatter] - The input formatter function to apply on each character.
 * @returns - The normalized text.
 */
export const normalizeText = (
  text: string,
  {
    inputFormatterSymbol: symbol = "0",
    inputFormatterAllowed: allowed,
    inputFormatterReplace: replace,
    inputFormatterTemplate: template = "",
    inputFormatter = (raw) =>
      formatText(raw, template, {
        symbol,
        allowed,
        replace,
      }),
  }: Partial<IConfig> = {}
) => {
  let result = typeof text === "string" ? text : "";
  result = "";
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    result = inputFormatter(result);
  }
  return result;
};

export default normalizeText;

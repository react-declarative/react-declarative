import IField from "../model/IField";
import formatText from "./formatText";

interface IConfig {
  inputFormatterSymbol: IField["inputFormatterSymbol"];
  inputFormatterAllowed: IField["inputFormatterAllowed"];
  inputFormatterReplace: IField["inputFormatterReplace"];
  inputFormatterTemplate: IField["inputFormatterTemplate"];
  inputFormatter: IField["inputFormatter"];
}

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

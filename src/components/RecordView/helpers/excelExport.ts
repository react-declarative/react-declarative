import * as XLSX from 'xlsx';

import isObject from '../../../utils/isObject';
import IData, { Value } from '../model/IData';

import keyToTitle from '../utils/keyToTitle';

/**
 * Converts a nested object to an array of arrays.
 *
 * @param obj - The input object to be converted.
 * @returns - The resulting array of arrays.
 */
const objToAoa = (obj: IData) => {
    /**
     * Processes the given object or value and generates a table representation.
     *
     * @param obj - The object or value to be processed.
     * @param [target=[]] - The target array to store the table representation.
     * @returns - The table representation of the object or value.
     */
    const process = (obj: IData | Value, target: any[] = []) => {
        Object.entries(obj).forEach(([key, value]) => {
            const label = keyToTitle(key);
            if (isObject(value) || Array.isArray(value)) {
                const result = process(value);
                target.push([label]);
                result.forEach((row) => {
                    target.push(["", ...row]);
                });
            } else {
                target.push([label, String(value)]);
            }
        });
        return target;
    };
    return process(obj);
};

/**
 * Export data to Excel.
 *
 * @param data - The data to export to Excel.
 * @param [sheetName="Records"] - The name of the sheet in the Excel file. Default is "Records".
 */
export const excelExport = (data: IData, sheetName = "Records") => {
    const worksheet = XLSX.utils.aoa_to_sheet(objToAoa(data))
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const buffer = XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
    });
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheetName}.xlsx`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.addEventListener('click', () => queueMicrotask(() => {
        URL.revokeObjectURL(url);
    }), {
        once: true,
    });
    a.click();
};

export default excelExport;

import * as XLSX from 'xlsx';

import isObject from '../../../utils/isObject';
import IData, { Value } from '../model/IData';

import keyToTitle from '../utils/keyToTitle';

const objToAoa = (obj: IData) => {
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

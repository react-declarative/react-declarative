/**
 * Represents a data row in a table.
 * @interface
 */
export interface IRowData {
    id: RowId;
}

export type RowId = string | number;

export default IRowData;

/**
 * Represents a data row in a table.
 * @interface
 */
export interface IRowData {
    id: RowId;
}

/**
 * Represents a unique identifier for a row in a data table.
 */
export type RowId = string | number;

export default IRowData;

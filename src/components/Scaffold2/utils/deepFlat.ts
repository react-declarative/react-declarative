import IScaffold2Group, { IScaffold2GroupInternal } from '../model/IScaffold2Group';
import IScaffold2Option, { IScaffold2OptionInternal } from '../model/IScaffold2Option';

/**
 * Represents a group of records.
 *
 * @typedef {Object} GroupRecords
 * @property {string} id - The identifier of the group.
 * @property {string} name - The name of the group.
 * @property {string[]} records - An array of record IDs belonging to the group.
 * @property {number} count - The number of records in the group.
 * @property {boolean} isActive - Indicates whether the group is active or not.
 * @property {Date} createdAt - The creation date of the group.
 * @property {Date} updatedAt - The last update date of the group.
 */
type GroupRecords = {
  [Prop in keyof IScaffold2Group]: IScaffold2Group[Prop];
} & IScaffold2GroupInternal;

/**
 * Represents a collection of option records for scaffolding.
 * @class
 */
type OptionRecords = {
  [Prop in keyof IScaffold2Option]: IScaffold2Option[Prop];
} & IScaffold2OptionInternal;

/**
 * Represents an entry that combines group records and option records.
 * @typedef {Object} Entry
 * @property {GroupRecords} groupRecords - The group records.
 * @property {OptionRecords} optionRecords - The option records.
 */
export type Entry = GroupRecords & OptionRecords;

/**
 * Represents a record that can be either an `IScaffold2Group` or an `IScaffold2Option`.
 *
 * @typedef {IScaffold2Group | IScaffold2Option} Record
 */
type Record = IScaffold2Group | IScaffold2Option;

/**
 * Flattens a deep nested array of records into a flat array of entries.
 * An entry is an object with an 'id' property and an optional 'path' property.
 * The 'path' property is a concatenation of the parent prefixes and the entry's own id.
 *
 * @param records - The deep nested array of records to flatten.
 * @returns The flat array of entries.
 */
export const deepFlat = (records: Record[]) => {
  const result: Array<Entry> = [];
  const process = (entries: Entry[], prefix = 'root') =>
    entries.forEach((entry) => {
      const name = `${prefix}.${entry.id}`;
      if (Array.isArray(entry.children)) {
        entry.path = name;
        result.push(entry);
        process(entry.children as Entry[], name);
      } else if (Array.isArray(entry.options)) {
        entry.path = name;
        result.push(entry);
        process(entry.options as Entry[], name);
      } else {
        entry.path = name;
        result.push(entry);
      }
    });
  process(records as Entry[]);
  return result;
};

export default deepFlat;

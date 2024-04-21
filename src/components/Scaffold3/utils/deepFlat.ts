import IScaffold3Group, { IScaffold3GroupInternal } from '../model/IScaffold3Group';
import IScaffold3Option, { IScaffold3OptionInternal } from '../model/IScaffold3Option';

/**
 * Represents a group of records.
 *
 * @typedef GroupRecords
 * @property id - The identifier of the group.
 * @property name - The name of the group.
 * @property records - An array of record IDs belonging to the group.
 * @property count - The number of records in the group.
 * @property isActive - Indicates whether the group is active or not.
 * @property createdAt - The creation date of the group.
 * @property updatedAt - The last update date of the group.
 */
type GroupRecords = {
  [Prop in keyof IScaffold3Group]: IScaffold3Group[Prop];
} & IScaffold3GroupInternal;

/**
 * Represents a collection of option records for scaffolding.
 * @class
 */
type OptionRecords = {
  [Prop in keyof IScaffold3Option]: IScaffold3Option[Prop];
} & IScaffold3OptionInternal;

/**
 * Represents an entry that combines group records and option records.
 * @typedef Entry
 * @property groupRecords - The group records.
 * @property optionRecords - The option records.
 */
export type Entry = GroupRecords & OptionRecords;

/**
 * Represents a record that can be either an `IScaffold3Group` or an `IScaffold3Option`.
 *
 * @typedef Record
 */
type Record = IScaffold3Group | IScaffold3Option;

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

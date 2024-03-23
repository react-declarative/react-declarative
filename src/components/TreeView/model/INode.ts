/**
 * Represents a Node in a tree structure.
 */
export interface INode {
  label: string;
  value: string;
  /**
   * Represents an array of child nodes excluding the "child" property (recursion).
   *
   * @typedef {Array<Omit<INode, "child">>} ChildArray
   */
  child?: Omit<INode, "child">[];
}

export default INode;

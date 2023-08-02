export interface INode {
  label: string;
  value: string;
  child?: Omit<INode, "child">[];
}

export default INode;

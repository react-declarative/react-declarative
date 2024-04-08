import { BrowserHistory, HashHistory, MemoryHistory } from "history";

/**
 * Represents a history object used for navigation.
 * @typedef History
 */
export type History = MemoryHistory | BrowserHistory | HashHistory;

export default History;

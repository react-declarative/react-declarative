import { BrowserHistory, HashHistory, MemoryHistory } from "history";

export type History = MemoryHistory | BrowserHistory | HashHistory;

export default History;

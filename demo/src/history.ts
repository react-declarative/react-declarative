import { createWindowHistory } from 'react-declarative';

export const history = createWindowHistory();

(window as any).historyJs = history;

export default history;

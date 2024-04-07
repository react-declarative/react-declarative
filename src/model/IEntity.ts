import IAnything from './IAnything';
import IField, { Value } from './IField';

type exclude = 'defaultValue'

/**
 * Объект сущность представляет собой поле прикладного
 * программииста, расширенное входным параметром и
 * коллбеком изменения для внутренней организации
 * работы. ВАЖНО - изменение поля влечет изменение
 * всего целевого объекта, следуя паттерну immutable
 */
export interface IEntity<Data = IAnything, Payload = IAnything> extends Omit<IField<Data, Payload>, exclude> {
  readTransform?: (value: Value, name: string, data: Data, payload: Payload) => Value;
  writeTransform?: (value: Value, name: string, data: Data, payload: Payload) => Value;
  change?: (object: Data, invalidMap: Record<string, boolean>) => void;
  invalidity: (name: string, msg: string, payload: Payload) => void;
  fallback: (e: Error) => void;
  isBaselineAlign: boolean;
  outlinePaper: boolean;
  transparentPaper: boolean;
  dirty?: boolean;
  prefix: string;
  ready: () => void;
  object: Data;
}

export default IEntity;

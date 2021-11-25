import IAnything from './IAnything';
import IField from './IField';

type exclude = 'defaultValue'

/**
 * Объект сущность представляет собой поле прикладного
 * программииста, расширенное входным параметром и
 * коллбеком изменения для внутренней организации
 * работы. ВАЖНО - изменение поля влечет изменение
 * всего целевого объекта, следуя паттерну immutable
 */
export interface IEntity<Data = IAnything> extends Omit<IField<Data>, exclude> {
  change?: (object: Data) => void;
  invalidity: (msg: string) => void;
  fallback: (e: Error) => void;
  ready: () => void;
  object: Data;
}

export default IEntity;

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
export interface IEntity extends Omit<IField, exclude> {
  change?: (object: IAnything) => void;
  invalidity: (msg: string) => void;
  ready: () => void;
  object: IAnything;
}

export default IEntity;

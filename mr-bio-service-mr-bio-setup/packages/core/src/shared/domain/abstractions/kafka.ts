// NOTE: Not used. Maybe used if bare kafka is used instead of NestJS implementation
import { EventTopic } from '../enum';
import { KafkaConfig } from 'kafkajs';

export type Listener<T = any> = (data: T) => Promise<void | any>;

export abstract class KafkaConsumer {
  abstract connect(config: KafkaConfig, topics: EventTopic[], groupId: string): Promise<void>;
  abstract consume<T>(topic: EventTopic, callback: Listener<T>): void;
}

export abstract class KafkaProducer {
  abstract connect(config: KafkaConfig): Promise<void>;
  abstract produce(topic: EventTopic, data: any, partitionIndex?: number): Promise<unknown>;
}

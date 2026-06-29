// NOTE: Not used. Maybe used if bare kafka is used instead of NestJS implementation
import { Kafka, KafkaConfig } from 'kafkajs';
import { Injectable, Logger } from '@nestjs/common';
import { KafkaConsumer, Listener } from '../../shared/domain/abstractions/kafka';
import {
  BaseConfigService,
  DomainException,
  EventTopic,
  attachEnv,
  coreErrorMessage,
  detachEnv,
  isJsonString,
} from '../../shared';

@Injectable()
export class KafkaConsumerImpl implements KafkaConsumer {
  private kafkaClient: Kafka;
  private listenerMap = new Map<EventTopic, Set<Listener>>();

  constructor(
    private configService: BaseConfigService,
    private logger: Logger
  ) {}

  async connect(config: KafkaConfig, topics: EventTopic[], consumerGroupId: string): Promise<void> {
    if (!this.kafkaClient) this.kafkaClient = new Kafka(config);
    await this._consume(
      topics.map(topic => attachEnv(this.configService.app.env, topic)),
      attachEnv(this.configService.app.env, consumerGroupId)
    );
  }

  consume<T>(topic: EventTopic, callback: Listener<T>): void {
    const listeners = this.listenerMap.get(topic) ?? new Set();
    listeners.add(callback);
    this.listenerMap.set(topic, listeners);
  }

  private async _consume(topics: string[], groupId: string) {
    if (!this.kafkaClient)
      throw new DomainException(coreErrorMessage.DEFAULT_ERROR, {
        error: 'Kafka client not initialized',
      });

    const consumer = this.kafkaClient.consumer({ groupId });
    await consumer.connect();

    await consumer.subscribe({ topics, fromBeginning: true });
    this.logger.debug(`Consumer | Topics [${topics.join(', ')}] subscribed successfully!`);

    consumer.run({
      eachMessage: async result => {
        const { topic, message, partition } = result;
        const listeners = this.listenerMap.get(
          detachEnv(this.configService.app.env, topic) as EventTopic
        );

        const value = message.value?.toString() || '';
        this.logger.debug(`Consumer | ${groupId}: [${topic}]: [Partition:${partition}]: `, value);
        const data = isJsonString(value) ? JSON.parse(value) : value;

        if (listeners) {
          for (const listener of listeners) {
            await listener(data)
              .then(x => this.logger.debug('Consumer | Listener processed successfully!', x))
              .catch(err => this.logger.error('Consumer | Listener Processing Failed!', err));
          }
        }
      },
    });
  }
}

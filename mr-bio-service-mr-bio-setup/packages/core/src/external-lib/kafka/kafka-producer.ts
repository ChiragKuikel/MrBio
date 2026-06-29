// NOTE: Not used. Maybe used if bare kafka is used instead of NestJS implementation
import { Injectable } from '@nestjs/common';
import { Kafka, KafkaConfig, Producer } from 'kafkajs';
import { KafkaProducer } from '../../shared/domain/abstractions/kafka';
import { BaseConfigService, EventTopic, Logger, attachEnv } from '../../shared';

@Injectable()
export class KafkaProducerImpl implements KafkaProducer {
  private kafkaClient: Kafka;

  constructor(
    private configService: BaseConfigService,
    private logger: Logger
  ) {}

  async connect(config: KafkaConfig): Promise<void> {
    if (!this.kafkaClient) this.kafkaClient = new Kafka(config);
  }

  async produce(topic: EventTopic, data: any, partitionIndex?: number): Promise<unknown> {
    topic = attachEnv(this.configService.app.env, topic) as EventTopic;
    this.logger.debug(`Producer | Publishing Topic ${topic}...`);
    if (!this.kafkaClient) throw new Error('Kafka client not initialized!');

    const producer = this.kafkaClient.producer({ allowAutoTopicCreation: true });

    return await this._send(producer, topic, data, partitionIndex);
  }

  private async _send(producer: Producer, topic: string, data: any, partitionIndex?: number) {
    try {
      await producer.connect();
      const result = await producer.send({
        topic,
        messages: [
          {
            ...(partitionIndex ? { partition: partitionIndex } : {}),
            value: JSON.stringify({ data }),
          },
        ],
      });

      return result;
    } catch (error) {
      this.logger.error('Kafka Producer Error!', error);
    } finally {
      await producer.disconnect();
    }
  }
}

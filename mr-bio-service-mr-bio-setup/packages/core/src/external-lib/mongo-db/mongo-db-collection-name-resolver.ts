import { toCamelCase } from '../../shared';

export abstract class MongoDbCollectionNameResolver {
  microserviceName: string;

  constructor(microserviceName: string) {
    this.microserviceName = toCamelCase(microserviceName);
  }

  protected resolve(collectionName: string): string {
    return `${this.microserviceName}_${collectionName}`;
  }
}

import { UnitOfWork } from '../abstractions';

export class MockUnitOfWork implements UnitOfWork {
  execute = jest.fn(async (callback: (session: any) => Promise<any>) => {
    return await callback({});
  });
}

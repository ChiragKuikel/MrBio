import { Global, Module } from '@nestjs/common';
import { ChangeStreamService } from './service/change-stream-service';

@Global()
@Module({
  exports: [ChangeStreamService],
  providers: [ChangeStreamService],
})
export class ChangeStreamModule {}

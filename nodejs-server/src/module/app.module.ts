import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository.module';
import { ServiceModule } from './service.module';

@Module({
  imports: [RepositoryModule, ServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

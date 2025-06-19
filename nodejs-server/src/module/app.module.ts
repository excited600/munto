import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository.module';
import { ServiceModule } from './service.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    RepositoryModule,
    ServiceModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule { }

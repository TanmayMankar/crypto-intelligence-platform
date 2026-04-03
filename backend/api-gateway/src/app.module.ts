import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoModule } from './crypto/crypto.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisService } from './redis/redis.service';
import { PredictionService } from './prediction/prediction.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'crypto',
      password: 'crypto',
      database: 'crypto_intelligence',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CryptoModule,
  ],
  controllers: [AppController],
  providers: [AppService,RedisService,PredictionService],
})
export class AppModule {}
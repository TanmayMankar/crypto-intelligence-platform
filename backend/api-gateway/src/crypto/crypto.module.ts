import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { Crypto } from './crypto.entity';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';

import { RedisModule } from '../redis/redis.module';
import { CryptoGateway } from './crypto.gateway';
import { AnalyticsService } from './analytics.service';
import { PredictionService } from 'src/prediction/prediction.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([Crypto]),
    HttpModule,
    RedisModule
  ],
  controllers: [CryptoController],
  providers: [CryptoService,CryptoGateway,AnalyticsService,PredictionService],
})
export class CryptoModule {}
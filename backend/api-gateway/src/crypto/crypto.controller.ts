import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PredictionService } from '../prediction/prediction.service';

@Controller('crypto')
export class CryptoController {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly analyticsService: AnalyticsService,
    private readonly predictionService: PredictionService,
  ) {}

  @Get('analytics/:symbol')
  async getAnalytics(@Param('symbol') symbol: string) {
    const history = await this.cryptoService.getHistory(symbol);

    const prices = history.map((h) => h.price);

    const ma = this.analyticsService.movingAverage(prices, 5);

    const rsi = this.analyticsService.calculateRSI(prices, 14);

    const signal = this.analyticsService.calculateSignal(prices, ma, rsi);

    return {
      prices,
      movingAverage5: ma,
      rsi,
      signal,
    };
  }

  @Get('prices')
  async getPrices() {
    return this.cryptoService.getPrices();
  }

  @Get('history/:symbol')
  async getHistory(@Param('symbol') symbol: string) {
    return this.cryptoService.getHistory(symbol);
  }

  @Get('predict/:symbol')
  async predict(@Param('symbol') symbol: string) {
    const history = await this.cryptoService.getHistory(symbol);

    const prices = history.map((h) => h.price);

    return this.predictionService.predict(prices);
  }

  @Get('whale/:symbol')
  async whale(@Param('symbol') symbol: string) {
    const history = await this.cryptoService.getHistory(symbol);

    const prices = history.map((h) => h.price);

    return this.analyticsService.detectWhaleMovement(prices);
  }

  @Get('whale-predict/:symbol')
  async whalePredict(@Param('symbol') symbol: string) {
    const history = await this.cryptoService.getHistory(symbol);

    const prices = history.map((h) => h.price);

    const rsi = this.analyticsService
      .calculateRSI(prices)
      .filter((v): v is number => v !== null);

    return this.analyticsService.predictWhale(prices, rsi);
  }
}

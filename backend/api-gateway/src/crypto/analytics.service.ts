import { Injectable } from '@nestjs/common';
import { last } from 'rxjs';

@Injectable()
export class AnalyticsService {
  movingAverage(prices: number[], period: number): (number | null)[] {
    const lastPrices = prices.slice(0, 50);
    lastPrices.reverse();

    const result: (number | null)[] = [];

    for (let i = 0; i < lastPrices.length; i++) {
      if (i < period - 1) {
        result.push(null);
      } else {
        const slice = lastPrices.slice(i - period + 1, i + 1);

        const sum = slice.reduce((a, b) => a + b, 0);

        result.push(sum / period);
      }
    }

    return result;
  }

  calculateRSI(prices: number[], period = 14): (number | null)[] {
    const lastPrices = prices.slice(0, 50);
    lastPrices.reverse(); // take last 50 prices

    const result: (number | null)[] = [];

    for (let i = 0; i < lastPrices.length; i++) {
      if (i < period) {
        result.push(null);
        continue;
      }

      let gains = 0;
      let losses = 0;

      for (let j = i - period + 1; j <= i; j++) {
        const diff = lastPrices[j] - lastPrices[j - 1];

        if (diff > 0) gains += diff;
        else losses -= diff;
      }

      const avgGain = gains / period;
      const avgLoss = losses / period;

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;

      const rsi = 100 - 100 / (1 + rs);

      result.push(rsi);
    }

    return result;
  }

  calculateSignal(
    prices: number[],
    ma: (number | null)[],
    rsi: (number | null)[],
  ): string {
    const lastPrice = prices[prices.length - 1];
    const lastMA = ma[ma.length - 1];
    const lastRSI = rsi[rsi.length - 1];

    if (lastMA && lastRSI) {
      if (lastPrice > lastMA && lastRSI < 30) {
        return 'BUY';
      }

      if (lastPrice < lastMA && lastRSI > 70) {
        return 'SELL';
      }
    }

    return 'HOLD';
  }

  detectWhaleMovement(prices: number[]) {
    if (prices.length < 10) return null;

    const latest = prices[0];
    const past = prices[9];

    const changePercent = ((latest - past) / past) * 100;

    console.log('Latest:', latest);
    console.log('Past:', past);
    console.log('Change %:', changePercent);

    if (Math.abs(changePercent) > 1.5) {
      return {
        alert: true,
        percent: changePercent.toFixed(2),
        type: changePercent > 0 ? 'PUMP' : 'DUMP',
      };
    }

    return { alert: false };
  }

  predictWhale(prices: number[], rsi: number[]) {
    if (prices.length < 20) return { whaleProbability: 0 };

    const latest = prices[0];
    const prev = prices[1];

    const changePercent = ((latest - prev) / prev) * 100;

    let score = 0;

    if (Math.abs(changePercent) > 0.5) score++;

    const lastRSI = rsi[0];

    if (lastRSI > 70 || lastRSI < 30) score++;

    const volatility =
      Math.max(...prices.slice(0, 10)) - Math.min(...prices.slice(0, 10));

    if (volatility / latest > 0.01) score++;

    const probability = Math.min(score * 30, 90);

    return {
      whaleProbability: probability,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crypto } from './crypto.entity';
import { Cron } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { CryptoGateway } from './crypto.gateway';


@Injectable()
export class CryptoService {

  constructor(
    private httpService: HttpService,
    @InjectRepository(Crypto)
    private cryptoRepo: Repository<Crypto>,
    private readonly redisService: RedisService,
    private readonly cryptoGateway: CryptoGateway,
  ) {}

  async getHistory(symbol: string) {
    return this.cryptoRepo.find({
      where: { symbol },
      order: { lastUpdated: 'DESC' },
      take: 100,
    });
  }

  async getPrices() {

    // const cached = await this.redisService.get('crypto_prices');

    // if (cached) {
    //   console.log('Returning prices from Redis cache');

    //   const prices = JSON.parse(cached);

    //   this.cryptoGateway.sendPrices(prices); // 🔥 emit to websocket

    //   return prices;
    // }

    const url =
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd';

    const response = await firstValueFrom(
      this.httpService.get(url)
    );

    const data = response.data;

    const cryptos = [
      { symbol: 'BTC', name: 'Bitcoin', price: data.bitcoin.usd },
      { symbol: 'ETH', name: 'Ethereum', price: data.ethereum.usd },
      { symbol: 'SOL', name: 'Solana', price: data.solana.usd },
    ];

    for (const c of cryptos) {

      const entity = this.cryptoRepo.create({
        symbol: c.symbol,
        name: c.name,
        price: c.price,
        marketCap: 0,
        volume24h: 0,
        lastUpdated: new Date(),
      });

      await this.cryptoRepo.save(entity);
    }

    await this.redisService.set('crypto_prices', JSON.stringify(cryptos));
    this.cryptoGateway.sendPrices(cryptos);

    return cryptos;
  }

  @Cron('0 * * * * *')
    async updatePrices() {
    console.log('Auto updating crypto prices...');
    await this.getPrices();
    }
}
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Crypto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column('float')
  price: number;

  @Column('float')
  marketCap: number;

  @Column('float')
  volume24h: number;

  @Column()
  lastUpdated: Date;
}
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CryptoGateway {

  @WebSocketServer()
  server: Server;

  sendPrices(prices: any) {
    this.server.emit('prices', prices);
  }

}
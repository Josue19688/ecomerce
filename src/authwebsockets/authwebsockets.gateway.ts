import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthwebsocketsService } from './authwebsockets.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway(
  9000, {
    cors: { origin: '*' },
  }
)
export class AuthwebsocketsGateway implements OnGatewayConnection,OnGatewayDisconnect{

  @WebSocketServer() wss:Server;

  constructor(
    private readonly authwebsocketsService: AuthwebsocketsService,
    private readonly jwtService:JwtService
  ) {}


  async handleConnection(client:Socket) {
    // const token = client.handshake.headers.authentication as string;
    const token:any =client.handshake.query['x-token'];
    let payload:JwtPayload;
   
    try {
      payload = this.jwtService.verify(token);
      await this.authwebsocketsService.registerClient(client,payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    
    

    this.wss.emit('clients-update',this.authwebsocketsService.getConnectedClients())

    
  }


  handleDisconnect(client:Socket) {
    this.authwebsocketsService.removeClient(client.id);
    this.wss.emit('clients-update',this.authwebsocketsService.getConnectedClients())

  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client:Socket,payload:NewMessageDto){

    //!Emite unicamente al cliente
    // client.emit('message-from-server',{
    //   fullName:'Soy yo',
    //   message:payload.message
    // })

     //!Emitir a todos los clientes menos al cliente que emitio
      // client.broadcast.emit('message-from-server',{
      //   fullName:'Soy yo',
      //   message:payload.message
      // })

      //!Emite a todos incluyendo el cliente que lo emitio
      this.wss.emit('message-from-server',{
        fullName:this.authwebsocketsService.getUserFullName(client.id),
        message:payload.message
      })

      
      //!Para emitir a un cliente en especifico o personas en una sala
      // this.wss.to('clienteId').emit('message-from-server',{
      //   fullName:'Soy yo',
      //   message:payload.message
      // })


      //!Emitir a una sala en especifico y unir el cliente a la sala
      // client.join('ventas');
      // this.wss.to('ventas').emit('message-from-server',{
      //   fullName:'Soy yo',
      //   message:payload.message
      // })
  }

 


}
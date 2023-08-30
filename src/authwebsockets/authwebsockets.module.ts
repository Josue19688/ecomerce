import { Module } from '@nestjs/common';
import { AuthwebsocketsService } from './authwebsockets.service';
import { AuthwebsocketsGateway } from './authwebsockets.gateway';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AuthwebsocketsGateway, AuthwebsocketsService],
  imports:[
    AuthModule
  ]
})
export class AuthwebsocketsModule {}

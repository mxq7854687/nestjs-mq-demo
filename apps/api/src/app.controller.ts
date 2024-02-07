import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from 'apps/auth/src/dto/new-user.dto';
import { LoginDto } from 'apps/auth/src/dto/login.dto';
import { AuthGuard } from '@app/shared';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE')
    private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE')
    private readonly presenceService: ClientProxy,
  ) {}

  @Get('auth')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }

  @Post('auth')
  async postUser() {
    return this.authService.send(
      {
        cmd: 'send-user',
      },
      {},
    );
  }

  @UseGuards(AuthGuard)
  @Get('presence')
  async getPresence() {
    console.log('test');
    return this.presenceService.send(
      {
        cmd: 'get-presence',
      },
      {},
    );
  }

  @Post('auth/register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.send(
      {
        cmd: 'register',
      },
      {
        ...dto,
      },
    );
  }

  @Post('auth/login')
  async login(@Body() dto: LoginDto) {
    return this.authService.send(
      {
        cmd: 'login',
      },
      {
        ...dto,
      },
    );
  }
}

import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AccountLogin, AccountRegister } from "@purple-services/contracts";
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { LoginDTO } from '../dtos/login.dto';
import { RegisterDTO } from '../dtos/register.dto';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly rmqService: RMQService
    ) { }


    @Post('register')
    public async register(@Body() dto: RegisterDTO) {
        try {
            return this.rmqService.send<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, dto);
        } catch (e) {
            if (e instanceof Error) {
                throw new UnauthorizedException(e.message);
            }
        }
    }

    @Post('login')
    public async login(@Body() dto: LoginDTO) {
        try {
            return this.rmqService.send<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, dto);
        } catch (e) {
            if (e instanceof Error) {
                throw new UnauthorizedException(e.message);
            }
        }
    }
}
import { Body, Controller, Post } from '@nestjs/common';
import { AccountLogin, AccountRegister } from "@purple-services/contracts";
import { RMQRoute, RMQValidate } from 'nestjs-rmq';


@Controller('auth')
export class AuthController {

    constructor() { }


    @Post('register')
    public async register(@Body() dto: AccountRegister.Request) {

    }

    @Post('login')
    public async login(@Body() dto: AccountLogin.Request) {

    }
}
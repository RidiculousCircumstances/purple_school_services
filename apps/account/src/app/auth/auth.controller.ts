import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister } from "@purple-services/contracts";
import { AuthService } from './auth.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';


@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @RMQValidate()
    @RMQRoute(AccountRegister.topic)
    public async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
        return this.authService.register(dto);
    }

    @RMQValidate()
    @RMQRoute(AccountLogin.topic)
    public async login(@Body() dto: AccountLogin.Request): Promise<AccountLogin.Response> {
        const { id } = await this.authService.validate(dto);
        return this.authService.login(id);
    }
}
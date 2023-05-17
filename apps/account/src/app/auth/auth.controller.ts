import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }


    @Post('register')
    public async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    public async login(@Body() dto: LoginDto) {

        const { id } = await this.authService.validate(dto);

        return this.authService.login(id);
    }
}

export class RegisterDto {
    email: string;
    password: string;
    displayedName?: string;
}

export class LoginDto {
    email: string;
    password: string;
}
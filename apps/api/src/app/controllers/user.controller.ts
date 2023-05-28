import { Controller, Get, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';


@Controller('user')
export class UserController {

    constructor() { }


    @UseGuards(JWTAuthGuard)
    @Get('info')
    public async info(@UserId() userId: string) {
        return 'Hi there!';
    }

}
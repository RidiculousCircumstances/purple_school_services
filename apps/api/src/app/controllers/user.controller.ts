import { BadGatewayException, Controller, Get, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { RMQService } from 'nestjs-rmq';
import { AccountUserInfo } from '@purple-services/contracts';


@Controller('user')
export class UserController {

    constructor(private readonly rmqService: RMQService) { }


    @UseGuards(JWTAuthGuard)
    @Get('info')
    public async info(@UserId() id: string) {
        try {
            return this.rmqService.send<AccountUserInfo.Request, AccountUserInfo.Response>(AccountUserInfo.topic, { id });
        } catch (e) {
            if (e instanceof Error) {
                throw new BadGatewayException(e.message);
            }
        }
    }

}
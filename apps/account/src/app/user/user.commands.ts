import { Body, Controller, NotFoundException } from '@nestjs/common';
import { AccountChangeProfile } from '@purple-services/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositiories/user.repository';
import { UserEntity } from './entities/user.entity';
import { NotFoundError } from 'rxjs';

@Controller()
export class UserCommands {

    constructor(private readonly userRepository: UserRepository) { }

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    public async userInfo(@Body() { user, id }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
        const existedUser = await this.userRepository.findUserById(id);
        if (!existedUser) {
            throw new NotFoundException();
        }

        const userEntity = new UserEntity(existedUser).updateProfile(user.displayedName);
        this.userRepository.updateUser(userEntity);
        return {};
    }
}
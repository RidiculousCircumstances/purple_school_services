import { Body, Controller } from '@nestjs/common';
import { AccountUserInfo, AccountUserCoursesInfo } from '@purple-services/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositiories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserQueries {

    constructor(private readonly userRepository: UserRepository) { }

    @RMQValidate()
    @RMQRoute(AccountUserInfo.topic)
    public async userInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
        const user = await this.userRepository.findUserById(id);
        const profile = new UserEntity(user).getPublicProfile();
        return {
            profile
        };
    }

    @RMQValidate()
    @RMQRoute(AccountUserCoursesInfo.topic)
    public async userCourses(@Body() { id }: AccountUserCoursesInfo.Request): Promise<AccountUserCoursesInfo.Response> {
        const user = await this.userRepository.findUserById(id);
        return {
            courses: user.courses,
        };
    }
}
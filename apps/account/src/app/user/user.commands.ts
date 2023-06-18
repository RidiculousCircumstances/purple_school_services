import { Body, Controller, NotFoundException } from '@nestjs/common';
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@purple-services/contracts';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositiories/user.repository';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UserService } from './user.service';

@Controller()
export class UserCommands {

    constructor(private readonly userServive: UserService) { }


    /**
     * Обновить профиль пользователя
     * @param param0 
     * @returns 
     */
    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    public async changeProfile(@Body() { user, id }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
        return this.userServive.changeProfile(user, id);
    }

    /**
     * Получить ссылку для оплаты курса
     * @param param0 
     */
    @RMQValidate()
    @RMQRoute(AccountBuyCourse.topic)
    public async buyCourse(@Body() { userId, courseId }: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
        return this.userServive.buyCourse(userId, courseId);
    }

    /**
     * Проверить статус обработки платежа
     * @param param0 
     */
    @RMQValidate()
    @RMQRoute(AccountCheckPayment.topic)
    public async checkPayment(@Body() { userId, courseId }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
        return this.userServive.checkPayment(userId, courseId);
    }
}
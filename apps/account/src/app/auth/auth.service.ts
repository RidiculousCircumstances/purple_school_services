import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositiories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@purple-services/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AccountLogin, AccountRegister } from '@purple-services/contracts';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService) { }

    public async register({ email, password, displayedName }: AccountRegister.Request) {
        const oldUser = await this.userRepository.findUser(email);

        if (oldUser) {
            throw new Error('This email is already taken');
        }

        const newUserEntity = await new UserEntity({
            email,
            role: UserRole.Student,
            displayedName,
            hashedPassword: '',
        }).setPassword(password);

        const newUser = await this.userRepository.createUser(newUserEntity);

        return { email: newUser.email };
    }

    public async validate({ email, password }: AccountLogin.Request) {
        const user = await this.userRepository.findUser(email);

        if (!user) {
            throw new Error('Incorrect credentials');
        }

        const isValidPassword = await new UserEntity(user).validatePassword(password);

        if (!isValidPassword) {
            throw new Error('Incorrect credentials');
        }

        return { id: user._id };
    }


    public async login(id: string) {
        return {
            accessToken: await this.jwtService.signAsync({ id })
        }
    }
}

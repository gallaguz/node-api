import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IConfigService } from '@app/config';
import { TYPES } from '@app/types';
import {
    User,
    IUserService,
    IUserRepository,
    UserRegisterDto,
    UserLoginDto,
} from '@app/users';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private usersRepository: IUserRepository,
        @inject(TYPES.ConfigService) private configService: IConfigService,
    ) {}

    async createUser({
        email,
        name,
        password,
    }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));

        const existUser = await this.usersRepository.find(email);

        if (existUser) return null;

        return this.usersRepository.create(newUser);
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
        const existUser = await this.usersRepository.find(email);
        if (!existUser) return false;
        const newUser = new User(
            existUser.email,
            existUser.name,
            existUser.password,
        );
        return newUser.comparePassword(password);
    }

    async getUserInfo(email: string): Promise<UserModel | null> {
        return this.usersRepository.find(email);
    }
}

import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
        @inject(TYPES.ConfigService) private configService: IConfigService,
    ) {}

    async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));

        const existUser = await this.usersRepository.find(email);

        if (existUser) return null;

        return this.usersRepository.create(newUser);
    }
    async validateUser(dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}

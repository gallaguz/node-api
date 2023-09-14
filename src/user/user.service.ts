import { User, PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config/config.service.interface';
import {
    CLIENT_ERROR,
    STATUS_CODES_MESSAGES_MAP,
} from '@app/constants/status.codes';
import { TRACE_TYPE, Trace } from '@app/decorators/trace';
import { HttpError } from '@app/errors/http.error';
import { ILogger } from '@app/logger/logger.interface';
import { IPasswordService } from '@app/password/password.service.interface';
import { ITokenService } from '@app/token/token.service.interface';
import {
    TRefreshToken,
    TTokenDecoded,
    TTokens,
    TUuid,
} from '@app/token/token.types';
import { UserEntity } from '@app/user/user.entity';
import { IUserEntity } from '@app/user/user.entity.interface';
import { UserLoginDto } from '@app/user/user.login.dto';
import { UserRegisterDto } from '@app/user/user.register.dto';
import { IUserRepository } from '@app/user/user.repository.interface';
import { IUserService } from '@app/user/user.service.interface';
import { TLoginReturnType, TUserInfo } from '@app/user/user.types';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.TokenService) private tokenService: ITokenService,
        @inject(APP_KEYS.UserRepository)
        private usersRepository: IUserRepository,
        @inject(APP_KEYS.PasswordService)
        private passwordService: IPasswordService,
    ) {}

    @Trace(TRACE_TYPE.ASYNC)
    async registration({
        name,
        email,
        password,
    }: UserRegisterDto): Promise<User> {
        const existingUser: User | null =
            await this.usersRepository.getUserByEmail(email);

        if (existingUser) {
            throw new HttpError(409, 'User exist');
        }

        const userEntity: IUserEntity = new UserEntity(name, email);

        const passwordHash = await this.passwordService.hash(password);

        userEntity.setPassword(passwordHash);

        try {
            return this.usersRepository.create(userEntity);
        } catch (error) {
            throw new HttpError(400, 'Cant create user');
        }
    }

    @Trace(TRACE_TYPE.ASYNC)
    async login(dto: UserLoginDto): Promise<TLoginReturnType> {
        const existedUser: User | null =
            await this.usersRepository.getUserByEmail(dto.email);

        if (existedUser === null) {
            throw new HttpError(CLIENT_ERROR.CONFLICT, 'User not found');
        }

        const validated = await this.passwordService.compare(
            dto.password,
            existedUser.password,
        );

        if (!validated) {
            throw new HttpError(
                CLIENT_ERROR.UNAUTHORIZED,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.UNAUTHORIZED],
            );
        }

        const refreshToken: string = this.tokenService.generateRefreshToken(
            existedUser.id,
        );

        await this.tokenService.saveRefreshToken(refreshToken);

        const accessToken: string = this.tokenService.generateAccessToken(
            existedUser.id,
        );

        return { userId: existedUser.id, accessToken, refreshToken };
    }

    @Trace(TRACE_TYPE.ASYNC)
    async getUserInfo(userId: TUuid): Promise<TUserInfo> {
        let user;
        let tokens;

        try {
            user = await this.usersRepository.getUserByUserId(userId);
            tokens = await this.tokenService.findByUserId(userId);
        } catch (error) {
            if (error instanceof Error) {
                // StaticLogger.info('UserService: getUserInfo: err: ', error);
            }

            throw new HttpError(
                CLIENT_ERROR.BAD_REQUEST,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.BAD_REQUEST],
            );
        }

        if (!user) {
            throw new HttpError(
                CLIENT_ERROR.NOT_FOUND,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.NOT_FOUND],
            );
        }

        return { user, tokens };
    }

    // async activate(activationLink) {}

    // async logout(email, password) {}

    @Trace(TRACE_TYPE.ASYNC)
    async refresh(userId: TUuid): Promise<TTokens> {
        await this.getUserByIdWithError(userId);

        try {
            return this.tokenService.refresh(userId);
        } catch (error) {
            if (error instanceof Error) {
                this.loggerService.error(error.message);
            }

            throw new HttpError(
                CLIENT_ERROR.UNAUTHORIZED,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.UNAUTHORIZED],
            );
        }
    }

    @Trace(TRACE_TYPE.ASYNC)
    public async getUserByIdWithError(userId: TUuid): Promise<User> {
        const existingUser = await this.usersRepository.getUserByUserId(userId);

        if (!existingUser) {
            throw new HttpError(
                CLIENT_ERROR.NOT_FOUND,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.NOT_FOUND],
            );
        }

        return existingUser;
    }
}

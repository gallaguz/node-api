import { RefreshToken, User } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config';
import { Trace } from '@app/decorators';
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '@app/errors';
import { ILogger } from '@app/logger';
import { IPasswordService } from '@app/password';
import { ITokenService, TTokens, TUuid } from '@app/token';
import {
    IUserEntity,
    IUserRepository,
    IUserService,
    TLoginReturnType,
    TUserInfo,
    UserEntity,
    UserLoginDto,
    UserRegisterDto,
} from '@app/user';

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

    @Trace()
    async registration({
        name,
        email,
        password,
    }: UserRegisterDto): Promise<User> {
        const existedUser = await this.usersRepository.getUserByEmail(email);

        if (existedUser) {
            throw new ConflictError({ context: this.constructor.name });
        }
        try {
            const userEntity: IUserEntity = new UserEntity(name, email);

            const passwordHash: string = await this.passwordService.hash(
                password,
            );

            userEntity.setPassword(passwordHash);

            return this.usersRepository.create(userEntity);
        } catch (error) {
            throw new UnauthorizedError({
                originalError: error,
                context: this.constructor.name,
            });
        }
    }

    @Trace()
    async login(dto: UserLoginDto): Promise<TLoginReturnType> {
        const existedUser: User = await this.getUserByEmailWithError(dto.email);

        await this.passwordService.compare(dto.password, existedUser.password);

        const refreshToken: string = this.tokenService.generateRefreshToken(
            existedUser.id,
        );

        await this.tokenService.saveRefreshToken(refreshToken);

        const accessToken: string = this.tokenService.generateAccessToken(
            existedUser.id,
        );

        return { userId: existedUser.id, accessToken, refreshToken };
    }

    @Trace()
    async getUserInfo(userId: TUuid): Promise<TUserInfo> {
        try {
            const user: User = await this.getUserByIdWithError(userId);
            const tokens: Array<RefreshToken> =
                await this.tokenService.findByUserId(userId);
            return { user, tokens };
        } catch (error) {
            throw new BadRequestError({
                originalError: error,
                context: this.constructor.name,
            });
        }
    }

    // async activate(activationLink) {}

    // async logout(email, password) {}

    @Trace()
    async refresh(userId: TUuid): Promise<TTokens> {
        try {
            await this.getUserByIdWithError(userId);
            return this.tokenService.refresh(userId);
        } catch (error) {
            throw new UnauthorizedError({
                context: this.constructor.name,
                originalError: error,
            });
        }
    }

    @Trace()
    public async getUserByIdWithError(userId: TUuid): Promise<User> {
        const existingUser = await this.usersRepository.getUserByUserId(userId);

        if (!existingUser) {
            throw new NotFoundError({ context: this.constructor.name });
        }

        return existingUser;
    }

    @Trace()
    public async getUserByEmailWithError(email: string): Promise<User> {
        const existingUser = await this.usersRepository.getUserByEmail(email);

        if (!existingUser) {
            throw new NotFoundError({
                context: this.constructor.name,
                message: 'User not found',
            });
        }

        return existingUser;
    }
}

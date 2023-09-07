import { User, PrismaClient, RefreshToken } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';

import { IConfigService } from '@app/config';
import { CLIENT_ERROR, STATUS_CODES_MESSAGES_MAP } from '@app/constants';
import { HttpError } from '@app/errors';
import {
    ITokenService,
    TRefreshToken,
    TTokenDecoded,
    TTokens,
    TUuid,
} from '@app/token';
import { TYPES } from '@app/types';
import {
    IUserEntity,
    IUserRepository,
    IUserService,
    TLoginReturnType,
    TRegisterReturnType,
    TUserInfo,
    UserEntity,
    UserLoginDto,
    UserRegisterDto,
} from '@app/user';
import { ILogger } from 'src/common/logger';

@injectable()
export class UserService implements IUserService {
    private prisma: PrismaClient;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.TokenService) private tokenService: ITokenService,
        @inject(TYPES.UserRepository) private usersRepository: IUserRepository,
    ) {
        this.prisma = new PrismaClient();
    }

    async registration({
        name,
        email,
        password,
    }: UserRegisterDto): Promise<User> {
        const existingUser: User | null =
            await this.usersRepository.getUserByEmail(email);

        if (existingUser) {
            throw new HttpError(409, 'User exist', this.constructor.name);
        }

        const userEntity: IUserEntity = new UserEntity(name, email);
        userEntity.setPassword(
            await hash(password, Number(this.configService.get('SALT'))),
        );

        try {
            return this.usersRepository.create(userEntity);
        } catch (e) {
            this.logger.error(e);

            throw new HttpError(400, 'Cant create user');
        }
    }

    async login(dto: UserLoginDto): Promise<TLoginReturnType> {
        const existedUser: User | null =
            await this.usersRepository.getUserByEmail(dto.email);

        if (existedUser === null) {
            this.logger.error('User not found');
            throw new HttpError(409, 'User not found', 'login');
        }

        const validated = await this.validateUser(dto, existedUser);

        if (!validated) {
            throw new HttpError(
                CLIENT_ERROR.UNAUTHORIZED,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.UNAUTHORIZED],
                'login',
            );
        }

        const refreshToken: string =
            await this.tokenService.generateRefreshToken(existedUser.id);

        await this.tokenService.saveRefreshToken(refreshToken);

        const accessToken: string = await this.tokenService.generateAccessToken(
            existedUser.id,
        );

        return { accessToken, refreshToken };
    }

    async validateUser(dto: UserLoginDto, user: User): Promise<boolean> {
        return compare(dto.password, user.password);
    }

    async getUserInfo(userId: TUuid): Promise<TUserInfo> {
        let user;
        let tokens;

        try {
            user = await this.usersRepository.getUserByUserId(userId);
            tokens = await this.tokenService.findByUserId(userId);
        } catch (e) {
            this.logger.log('UserService: getUserInfo: err: ', e);
            throw new HttpError(
                CLIENT_ERROR.BAD_REQUEST,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.BAD_REQUEST],
                'info',
            );
        }

        if (!user) {
            throw new HttpError(
                CLIENT_ERROR.NOT_FOUND,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.NOT_FOUND],
                'info',
            );
        }

        return { user, tokens };
    }

    // async activate(activationLink) {}

    // async logout(email, password) {}

    async refresh(refreshToken: TRefreshToken): Promise<TTokens> {
        try {
            const decoded: TTokenDecoded =
                await this.tokenService.validateRefreshToken(refreshToken);

            return this.tokenService.refresh(decoded);
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(error.message);
            }

            throw new HttpError(
                CLIENT_ERROR.UNAUTHORIZED,
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.UNAUTHORIZED],
                'refresh',
            );
        }
    }
}

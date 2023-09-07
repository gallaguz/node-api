import { RefreshToken } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { Algorithm } from 'jsonwebtoken';

import { IConfigService } from '@app/config';
import { CLIENT_ERROR } from '@app/constants';
import {
    ITokenEntity,
    ITokenRepository,
    TokenEntity,
    ITokenService,
    TTokenDecoded,
    TUuid,
    TRefreshToken,
    TAccessToken,
} from '@app/token';
import { TYPES } from '@app/types';
import { ILogger, BaseService } from 'src/common';

import { TTokens } from '../types';

@injectable()
export class TokenService extends BaseService implements ITokenService {
    private readonly accessTokenSecret: string;
    private readonly accessTokenExpiresIn: string;
    private readonly refreshTokenSecret: string;
    private readonly refreshTokenExpiresIn: string;
    private readonly algorithm: Algorithm;

    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.TokenRepository)
        private tokenRepository: ITokenRepository,
    ) {
        super(loggerService);

        this.accessTokenSecret = this.configService.get('JWT_ACCESS_SECRET');
        this.accessTokenExpiresIn = this.configService.get(
            'JWT_ACCESS_EXPIRES_IN',
        );
        this.refreshTokenSecret = this.configService.get('JWT_REFRESH_SECRET');
        this.refreshTokenExpiresIn = this.configService.get(
            'JWT_REFRESH_EXPIRES_IN',
        );
        this.algorithm = <Algorithm>this.configService.get('JWT_ALGORITHM');
    }

    public async refresh({ userId }: TTokenDecoded): Promise<TTokens> {
        const accessToken = await this.generateAccessToken(userId);
        const refreshToken = await this.generateRefreshToken(userId);

        await this.saveRefreshToken(refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    public async saveRefreshToken(
        refreshToken: TRefreshToken,
    ): Promise<RefreshToken> {
        const decoded: TTokenDecoded = await this.validateRefreshToken(
            refreshToken,
        );

        try {
            return this.tokenRepository.create(refreshToken, decoded);
        } catch (error) {
            throw this.serviceError({
                originalError: error,
                message: 'Error during Refresh Token saving',
            });
        }
    }

    public async generateRefreshToken(uuid: TUuid): Promise<TRefreshToken> {
        try {
            const refreshTokenEntity: ITokenEntity = new TokenEntity(
                this.refreshTokenSecret,
            );

            return refreshTokenEntity.signAsync(
                uuid,
                this.refreshTokenExpiresIn,
                this.algorithm,
            );
        } catch (error) {
            throw this.serviceError({
                message: 'RefreshToken sign failed',
            });
        }
    }

    public async generateAccessToken(uuid: TUuid): Promise<TAccessToken> {
        try {
            const accessTokenEntity: ITokenEntity = new TokenEntity(
                this.accessTokenSecret,
            );

            return accessTokenEntity.signAsync(
                uuid,
                this.accessTokenExpiresIn,
                this.algorithm,
            );
        } catch (error) {
            if (error instanceof Error) {
                this.loggerService.error(error.message);
            }
            throw this.serviceError({
                message: 'Cant generate AccessToken',
            });
        }
    }

    public async validateRefreshToken(
        token: TRefreshToken,
    ): Promise<TTokenDecoded> {
        try {
            const refreshTokenEntity: ITokenEntity = new TokenEntity(
                this.refreshTokenSecret,
            );
            return refreshTokenEntity.verifyAsync(token);
        } catch (error) {
            if (error instanceof Error) {
                this.loggerService.error(error.message);
            }
            throw this.serviceError({
                message: 'RefreshToken verification failed',
            });
        }
    }

    public async validateAccessToken(
        token: TAccessToken,
    ): Promise<TTokenDecoded> {
        try {
            const refreshTokenEntity: ITokenEntity = new TokenEntity(
                this.accessTokenSecret,
            );
            return refreshTokenEntity.verifyAsync(token);
        } catch (error) {
            throw this.serviceError({
                originalError: error,
                message: 'Access Token validation',
            });
        }
    }

    public async findByUserId(userId: TUuid): Promise<Array<RefreshToken>> {
        let tokens;
        try {
            tokens = await this.tokenRepository.findByUserId(userId);
        } catch (error) {
            throw this.serviceError({
                originalError: error,
                message: 'Refresh Token not found',
            });
        }

        if (!tokens.length) {
            throw this.serviceError({
                message: 'Refresh Tokens not found',
                statusCode: CLIENT_ERROR.NOT_FOUND,
            });
        }

        return tokens;
    }
}

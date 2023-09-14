import { RefreshToken } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { Algorithm } from 'jsonwebtoken';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config/config.service.interface';
import { TRACE_TYPE, Trace } from '@app/decorators/trace';
import { ILogger } from '@app/logger/logger.interface';
import { TokenEntity } from '@app/token/token.entity';
import { ITokenEntity } from '@app/token/token.entity.interface';
import { ITokenRepository } from '@app/token/token.repository.interface';
import { ITokenService } from '@app/token/token.service.interface';
import {
    TAccessToken,
    TRefreshToken,
    TTokenDecoded,
    TTokens,
    TUuid,
} from '@app/token/token.types';

@injectable()
export class TokenService implements ITokenService {
    private readonly accessTokenSecret: string;
    private readonly accessTokenExpiresIn: string;
    private readonly refreshTokenSecret: string;
    private readonly refreshTokenExpiresIn: string;
    private readonly algorithm: Algorithm;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.TokenRepository)
        private tokenRepository: ITokenRepository,
    ) {
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

    @Trace(TRACE_TYPE.ASYNC)
    public async refresh(userId: TUuid): Promise<TTokens> {
        const accessToken = await this.generateAccessToken(userId);
        const refreshToken = await this.generateRefreshToken(userId);

        await this.saveRefreshToken(refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    @Trace(TRACE_TYPE.ASYNC)
    public async saveRefreshToken(
        refreshToken: TRefreshToken,
    ): Promise<RefreshToken> {
        const decoded: TTokenDecoded = await this.validateRefreshToken(
            refreshToken,
        );

        return this.tokenRepository.create(refreshToken, decoded);
    }

    @Trace(TRACE_TYPE.SYNC)
    public generateToken(
        userId: TUuid,
        secret: string,
        exp: string,
    ): TAccessToken | TRefreshToken {
        const tokenEntity: ITokenEntity = new TokenEntity(secret);

        return tokenEntity.sign(userId, exp, this.algorithm);
    }

    @Trace(TRACE_TYPE.SYNC)
    public validateToken(
        token: TAccessToken | TRefreshToken,
        secret: string,
    ): TTokenDecoded {
        const tokenEntity: ITokenEntity = new TokenEntity(secret);
        return tokenEntity.verify(token);
    }

    @Trace(TRACE_TYPE.SYNC)
    public generateRefreshToken(userId: TUuid): TRefreshToken {
        return this.generateToken(
            userId,
            this.refreshTokenSecret,
            this.refreshTokenExpiresIn,
        );
    }

    @Trace(TRACE_TYPE.SYNC)
    public generateAccessToken(userId: TUuid): TAccessToken {
        return this.generateToken(
            userId,
            this.accessTokenSecret,
            this.accessTokenExpiresIn,
        );
    }

    @Trace(TRACE_TYPE.SYNC)
    public validateRefreshToken(token: TRefreshToken): TTokenDecoded {
        return this.validateToken(token, this.refreshTokenSecret);
    }

    @Trace(TRACE_TYPE.SYNC)
    public validateAccessToken(token: TAccessToken): TTokenDecoded {
        return this.validateToken(token, this.accessTokenSecret);
    }

    @Trace(TRACE_TYPE.SYNC)
    public async findByUserId(userId: TUuid): Promise<Array<RefreshToken>> {
        return this.tokenRepository.findByUserId(userId);
    }
}

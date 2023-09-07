import { sign, verify, SignOptions, Algorithm } from 'jsonwebtoken';

import {
    ITokenEntity,
    TAccessToken,
    TRefreshToken,
    TTokenDecoded,
    TUuid,
} from '@app/token';

export class TokenEntity implements ITokenEntity {
    constructor(private readonly _secret: string) {}

    public sign(
        userId: TUuid,
        expiresIn: string,
        algorithm: Algorithm,
    ): TAccessToken | TRefreshToken {
        try {
            const payload = { userId };

            const options: SignOptions = {
                algorithm: algorithm,
                expiresIn: expiresIn,
            };
            return sign(payload, this._secret, options);
        } catch (error) {
            throw new Error('Sign token error');
        }
    }

    public async signAsync(
        userId: TUuid,
        expiresIn: string,
        algorithm: Algorithm,
    ): Promise<TAccessToken | TRefreshToken> {
        const payload = { userId };

        const options: SignOptions = {
            algorithm: algorithm,
            expiresIn: expiresIn,
        };
        return new Promise((resolve, reject) => {
            return sign(payload, this._secret, options, (err, token) => {
                if (err || !token) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    public verify(token: TAccessToken | TRefreshToken): TTokenDecoded {
        const verified: string | TTokenDecoded = <string | TTokenDecoded>(
            verify(token, this._secret)
        );

        if (typeof verified === 'string') {
            throw new Error(verified);
        }

        return verified;
    }

    public async verifyAsync(
        token: TAccessToken | TRefreshToken,
    ): Promise<TTokenDecoded> {
        return new Promise((resolve, reject) => {
            return verify(token, this._secret, (err, token) => {
                if (err || !token) {
                    reject(err);
                } else {
                    if (typeof token === 'string') {
                        reject(token);
                    }
                    resolve(<TTokenDecoded>token);
                }
            });
        });
    }
}

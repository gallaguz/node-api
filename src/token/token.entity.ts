import { sign, verify, SignOptions, Algorithm } from 'jsonwebtoken';

import { Trace } from '@app/decorators/trace';
import { ITokenEntity } from '@app/token/token.entity.interface';
import {
    TAccessToken,
    TRefreshToken,
    TTokenDecoded,
    TUuid,
} from '@app/token/token.types';

export class TokenEntity implements ITokenEntity {
    constructor(private readonly _secret: string) {}

    @Trace()
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
            // TODO
            throw new Error('Sign token error');
        }
    }

    @Trace()
    public verify(token: TAccessToken | TRefreshToken): TTokenDecoded {
        const verified: string | TTokenDecoded = <string | TTokenDecoded>(
            verify(token, this._secret, {
                clockTolerance: 5,
            })
        );

        if (typeof verified === 'string') {
            // TODO
            throw new Error(verified);
        }

        return verified;
    }
}

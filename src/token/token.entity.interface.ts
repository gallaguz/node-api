import { Algorithm } from 'jsonwebtoken';

import {
    TAccessToken,
    TRefreshToken,
    TTokenDecoded,
    TUuid,
} from '@app/token/token.types';

export interface ITokenEntity {
    sign(
        userId: TUuid,
        expiresIn: string,
        algorithm: Algorithm,
    ): TAccessToken | TRefreshToken;
    verify(token: TAccessToken | TRefreshToken): TTokenDecoded;
}

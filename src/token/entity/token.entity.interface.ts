import { Algorithm } from 'jsonwebtoken';

import { TAccessToken, TRefreshToken, TTokenDecoded, TUuid } from '@app/token';

export interface ITokenEntity {
    sign(
        userId: TUuid,
        expiresIn: string,
        algorithm: Algorithm,
    ): TAccessToken | TRefreshToken;
    signAsync(
        userId: TUuid,
        expiresIn: string,
        algorithm: Algorithm,
    ): Promise<TAccessToken | TRefreshToken>;
    verify(token: TAccessToken | TRefreshToken): TTokenDecoded;
    verifyAsync(token: TAccessToken | TRefreshToken): Promise<TTokenDecoded>;
}

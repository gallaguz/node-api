import { RefreshToken } from '@prisma/client';

import {
    TAccessToken,
    TRefreshToken,
    TTokenDecoded,
    TTokens,
    TUuid,
} from '@app/token';

export interface ITokenService {
    generateRefreshToken(uuid: TUuid): Promise<string>;
    generateAccessToken(uuid: TUuid): Promise<string>;
    validateAccessToken(token: TAccessToken): Promise<TTokenDecoded>;
    validateRefreshToken(token: TRefreshToken): Promise<TTokenDecoded>;
    saveRefreshToken(token: TRefreshToken): Promise<RefreshToken>;
    findByUserId(userId: TUuid): Promise<Array<RefreshToken>>;
    refresh(decoded: TTokenDecoded): Promise<TTokens>;
}

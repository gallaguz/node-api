import { RefreshToken } from '@prisma/client';

import {
    TAccessToken,
    TRefreshToken,
    TTokenDecoded,
    TTokens,
    TUuid,
} from '@app/token/token.types';

export interface ITokenService {
    generateRefreshToken(uuid: TUuid): string;
    generateAccessToken(uuid: TUuid): string;
    validateAccessToken(token: TAccessToken): TTokenDecoded;
    validateRefreshToken(token: TRefreshToken): TTokenDecoded;
    saveRefreshToken(token: TRefreshToken): Promise<RefreshToken>;
    findByUserId(userId: TUuid): Promise<Array<RefreshToken>>;
    refresh(uuid: TUuid): Promise<TTokens>;
}

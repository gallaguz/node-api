import { RefreshToken } from '@prisma/client';

import { TRefreshToken, TTokenDecoded, TUuid } from '@app/token';

export interface ITokenRepository {
    create(token: TRefreshToken, decoded: TTokenDecoded): Promise<RefreshToken>;
    findByUserId(userId: TUuid): Promise<Array<RefreshToken>>;
}

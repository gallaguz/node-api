import { JwtPayload } from 'jsonwebtoken';

export type TUuid = string;

export type TTokenDecoded = {
    userId: TUuid;
    exp: number;
} & JwtPayload;

export type TAccessToken = string;
export type TRefreshToken = string;

export type TTokens = {
    accessToken: TAccessToken;
    refreshToken: TRefreshToken;
};

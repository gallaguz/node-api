import { IsEmail, IsString } from 'class-validator';

import { WRONG_EMAIL, WRONG_PASSWORD } from '@app/constants';

export class UserLoginDto {
    @IsEmail({}, { message: WRONG_EMAIL })
    email: string;

    @IsString({ message: WRONG_PASSWORD })
    password: string;
}

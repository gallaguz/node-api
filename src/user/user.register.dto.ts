import { IsEmail, IsString } from 'class-validator';

import { WRONG_EMAIL, WRONG_NAME, WRONG_PASSWORD } from '@app/constants/errors';

export class UserRegisterDto {
    @IsString({ message: WRONG_NAME })
    name: string;

    @IsEmail({}, { message: WRONG_EMAIL })
    email: string;

    @IsString({ message: WRONG_PASSWORD })
    password: string;
}

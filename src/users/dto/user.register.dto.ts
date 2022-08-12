import { IsString } from 'class-validator';

import { UserCredentialsDto } from './user.credentials.dto';

export class UserRegisterDto extends UserCredentialsDto {
    @IsString({ message: 'Wrong name' })
    name: string;
}

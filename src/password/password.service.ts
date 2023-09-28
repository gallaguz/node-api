import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config';
import { ENV_VARS } from '@app/constants';
import { Trace } from '@app/decorators';
import { UnauthorizedError } from '@app/errors';
import { ILogger } from '@app/logger';
import { IPasswordService } from '@app/password';

@injectable()
export class PasswordService implements IPasswordService {
    private readonly _salt: number;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
    ) {
        this._salt = Number(this.configService.get(ENV_VARS.SALT));
    }

    @Trace()
    public async hash(password: string): Promise<string> {
        return hash(password, this._salt);
    }

    @Trace()
    public async compare(
        password: string,
        passwordHash: string,
    ): Promise<boolean> {
        if (!(await compare(password, passwordHash))) {
            throw new UnauthorizedError({ context: this.constructor.name });
        }
        return true;
    }
}

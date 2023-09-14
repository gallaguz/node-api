import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config/config.service.interface';
import { TRACE_TYPE, Trace } from '@app/decorators/trace';
import { ILogger } from '@app/logger/logger.interface';
import { IPasswordService } from '@app/password/password.service.interface';

@injectable()
export class PasswordService implements IPasswordService {
    private readonly _salt: number;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
    ) {
        this._salt = Number(this.configService.get('SALT'));
    }

    @Trace(TRACE_TYPE.ASYNC)
    public async hash(password: string): Promise<string> {
        return hash(password, this._salt);
    }

    @Trace(TRACE_TYPE.ASYNC)
    public async compare(
        password: string,
        passwordHash: string,
    ): Promise<boolean> {
        return compare(password, passwordHash);
    }
}

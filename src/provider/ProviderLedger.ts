import { IConnectOptions, IProvider, IUserData, TLong, TTransactionParamWithType, } from '@waves/signer';
import { ITransport } from './interface';
import { TransportIframe } from './TransportIframe';
import { TransportWindow } from './TransportWindow';
import { config } from '@waves/waves-browser-bus';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';

const URL = '';

export class ProviderLedger implements Omit<Omit<Omit<Omit<Omit<IProvider, 'connect'>, 'logout'>, 'signMessage'>, 'signTypedData'>, 'signTypedData'> {
    private readonly _transport: ITransport;

    constructor(clientOrigin?: string, logs?: boolean) {
        clientOrigin =
            (clientOrigin || URL) +
            '?' +
            ProviderLedger._getCacheClean();
        const Transport = TransportIframe.canUse()
            ? TransportIframe
            : TransportWindow;

        this._transport = new Transport(clientOrigin, 3);
        if (logs === true) {
            config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;
        }
    }

    public async connect(options: IConnectOptions): Promise<void> {
        return Promise.resolve(
            this._transport.sendEvent((bus) =>
                bus.dispatchEvent('connect', options)
            )
        );
    }

    public sign(
        list: Array<TTransactionParamWithType>
    ): Promise<Array<TTransactionWithProofs<TLong> & IWithId>> {
        return this._transport.dialog((bus) => bus.request('sign', list));
    }

    private static _getCacheClean(): string {
        return String(Date.now() % (1000 * 60));
    }


    public login(): Promise<IUserData> {
        return this._transport.dialog((bus) => bus.request('login'));
    }

}

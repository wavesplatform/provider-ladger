import HwTransportWebusb from '@ledgerhq/hw-transport-webusb';
import {
    AuthEvents,
    ConnectOptions,
    Handler,
    Provider,
    SignerTx,
    SignedTx,
    TypedData,
    UserData,
} from '@waves/signer';
import WavesLedger from '@waves/ledger';
import { IWithId } from '@waves/ts-types';
import { libs, signTx } from '@waves/waves-transactions';
import { Waves } from '@waves/ledger/lib/Waves';

type TLong = any;

const WavesLedgerConfig = {
    debug: true,
    openTimeout: 3000,
    listenTimeout: 30000,
    exchangeTimeout: 30000,
    networkCode: 82, //stagenet
    transport: HwTransportWebusb
}

export class ProviderLedger implements Provider {
    private _publicKey: string = '';
    private _options: ConnectOptions = {
        NETWORK_BYTE: 'W'.charCodeAt(0),
        NODE_URL: 'https://nodes.wavesplatform.com',
    };
    private _wavesLedger: any;

    public user: UserData | null = null;

    public sign(
        list: Array<SignerTx>
    ): Promise<Array<SignedTx<TLong> & IWithId>> {
        return Promise.resolve(
            // list.map((params) =>
            //     signTx(
            //         {
            //             chainId: this._options.NETWORK_BYTE,
            //             ...params,
            //         } as any,
            //         this._seed
            //     )
            // )
            list.map((params) =>{
                // todo
            })
        ) as any;
    }

    public signTypedData(data: Array<TypedData>): Promise<string> {
        console.error('Not implemented');
        return Promise.resolve('/* TODO */');
    }

    public signMessage(data: string | number): Promise<string> {
        console.error('Not implemented');
        return Promise.resolve('/* TODO */');
    }

    public connect(options: ConnectOptions): Promise<void> {
        this._options = options;
        return Promise.resolve();
    }

    public login(): Promise<UserData> {
        const config = {
            ...WavesLedgerConfig,

        };

        this._wavesLedger = new WavesLedger(WavesLedgerConfig);

        const res = {
            // TODO login via ledger
            address: libs.crypto.address(
                this._publicKey,
                this._options.NETWORK_BYTE
            ),
            publicKey: libs.crypto.publicKey(this._publicKey),
        };
    
        return Promise.resolve(res);
    }

    public logout(): Promise<void> {
        return Promise.resolve();
    }

    public on<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider {
        console.error('Not implemented');
        return this;
    }

    public once<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider{
        console.error('Not implemented');
        return this;
    };

    public off<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider {
        console.error('Not implemented');
        return this;
    }
}
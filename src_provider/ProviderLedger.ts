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
// import { Waves } from '@waves/ledger/lib/Waves';

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
    private _options: ConnectOptions = {
        NETWORK_BYTE: 'W'.charCodeAt(0),
        NODE_URL: 'https://nodes.wavesplatform.com',
    };
    private _wavesLedger: any; // WavesLadger
    private _defaultUseId: number = 0;
    private _ledgerConfig: any = {}; // For debuggin

    public user: UserData | null = null;

    public sign(
        list: Array<SignerTx>
    ): Promise<Array<SignedTx<TLong> & IWithId>> {
        return Promise.all(
            list.map((tx: SignerTx) =>{
                const dataBuffer = this.str2ab(JSON.stringify(tx));

                const data2sign = {
                    dataType: tx.type,
                    dataVersion: tx.version,
                    dataBuffer: dataBuffer
                    // amountPrecision: tx.amountPrecision ?? null,
                    // amount2Precision: tx.amount2Precision ?? null,
                    // feePrecision: tx.feePrecision ?? null,
                };

                return this._wavesLedger.signTransaction(this._defaultUseId, data2sign);
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

    public ledgerConfig(cfg: any) {
        console.warn('Dont use this api in production');
        this._ledgerConfig = {
            ...this._ledgerConfig,
            ...cfg,
        };
    }

    public connect(options: ConnectOptions): Promise<void> {
        this._options = options;
        return Promise.resolve();
    }

    public login(): Promise<UserData> {
        const config = {
            ...WavesLedgerConfig,
            ...this._ledgerConfig
        };

        this._wavesLedger = new WavesLedger(config);

        return this._wavesLedger.getUserDataById(this._defaultUseId)
            .then((userData: UserData) => {
                const res: UserData = {
                    address: libs.crypto.address(
                        userData.publicKey,
                        this._options.NETWORK_BYTE
                    ),
                    publicKey: libs.crypto.publicKey(userData.publicKey),
                };
        
            return Promise.resolve(res);
        });

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

    private str2ab(str: string): ArrayBuffer {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}
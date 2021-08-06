import HwTransportWebusb from '@ledgerhq/hw-transport-webusb';
import {
    AuthEvents,
    ConnectOptions,
    Handler,
    Provider,
    SignerTx,
    TypedData,
    UserData,
} from '@waves/signer';
import { IUser, WavesLedgerSync, IWavesLedgerConfig } from '@waves/ledger';
import { libs, makeTx, makeTxBytes, signTx } from '@waves/waves-transactions';
// import { Waves } from '@waves/ledger/lib/Waves';
import { signerTx2TxParams } from "./helpers";
import {
    showConnecting as connectionDialog,
    showConnectionError as connectionErrorDialog,
    getUser as getUserDialog,
    signTx as signTxDialog,
    closeDialog,
    showConnectionError
} from "./ui";
import {
    IProviderLedgerConfig,
    ProviderSignedTx,
} from './ProviderLedger.interface';

const DEFAULT_PROVIDER_CONFIG = {
    debug: false,
}

const DEFAULT_WAVES_LEDGER_CONFIG: IWavesLedgerConfig = {
    debug: false,
    openTimeout: 3000,
    listenTimeout: 30000,
    exchangeTimeout: 30000,
    networkCode: 87,
    transport: HwTransportWebusb
};

export class ProviderLedger implements Provider {
    private _providerConfig: IProviderLedgerConfig;
    // todo connect to network
    private _options: ConnectOptions = {
        NETWORK_BYTE: 'W'.charCodeAt(0),
        NODE_URL: 'https://nodes.wavesplatform.com',
    };
    private _wavesLedger: WavesLedgerSync | null;
    private _ledgerConfig: IWavesLedgerConfig;

    public user: IUser | null = null;

    constructor(config?: IProviderLedgerConfig) {
        this._providerConfig = config || DEFAULT_PROVIDER_CONFIG;
        this._ledgerConfig = config?.wavesLedgerConfig || DEFAULT_WAVES_LEDGER_CONFIG;
        this._wavesLedger = null;

        this.__log('constructor');
    }

    public sign(
        list: Array<SignerTx>
    ): Promise<Array<ProviderSignedTx>> {
        this.__log('sign', list);

        if (!this.isLedgerConnected() || !this.user) {
            return this.loginFlow()
                .catch(() => { })
                .then(() => {
                    return this.sign(list);
                });
        }

        return Promise.all(
            list.map((tx: SignerTx): Promise<any> => {
                const publicKey: string = (this.user?.publicKey as string);
                const txParams = signerTx2TxParams(tx);
                // const signedTx = signTx(txParams, publicKey);
                const dataBuffer = makeTxBytes({
                    ...txParams,
                    senderPublicKey: publicKey,
                });

                signTxDialog(tx);

                const data2sign = {
                    dataType: txParams.type,
                    dataVersion: txParams.version,
                    dataBuffer: dataBuffer,
                    amountPrecision: 0,
                    amount2Precision: 0,
                    feePrecision: 0,
                    // amountPrecision: tx.amountPrecision ?? null,
                    // amount2Precision: tx.amount2Precision ?? null,
                    // feePrecision: tx.feePrecision ?? null,
                };

                return this._wavesLedger!.signTransaction(this.user!.id, data2sign)
                    .then((proof: string): any => {
                        const proofs = (tx.proofs || []);

                        proofs.push(proof);

                        let signedTx: any = {
                            // id: signedTx.id,
                            senderPublicKey: publicKey,

                            // original
                            ...txParams,
                            ...tx,
                            proofs: proofs
                        };

                        closeDialog();

                        this.__log('sign :: signed tx', signedTx);
                        return signedTx;
                    });
            })
        ) as any;
    }

    public signTypedData(data: Array<TypedData>): Promise<string> {
        this.__log('signTypedData');

        console.error('Not implemented');
        return Promise.resolve('/* TODO */');
    }

    public signMessage(data: string | number): Promise<string> {
        this.__log('signMessage');

        console.error('Not implemented');
        return Promise.resolve('/* TODO */');
    }

    public connect(options: ConnectOptions): Promise<void> {
        this.__log('connect', options);

        this._options = options;

        return Promise.resolve();
    }

    public login(): Promise<UserData> {
        this.__log('login');

        return this.initWavesLedger()
            .catch((er) => { throw er; })
            .then(async () => {
                const user: IUser = await getUserDialog(this._wavesLedger!);

                this.user =  user;

                this.__log('login :: user');
                return (user as UserData);
            });
    }

    public logout(): Promise<void> {
        this.__log('logout');

        return Promise.resolve();
    }

    public on<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider {
        this.__log('on');
        console.error('Not implemented');
        return this;
    }

    public once<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider{
        this.__log('once');
        console.error('Not implemented');
        return this;
    };

    public off<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider {
        this.__log('off');
        console.error('Not implemented');
        return this;
    }

    private initWavesLedger(): Promise<void> {
        this.__log('initWavesLedger');

        // if (!this._wavesLedger) {
        //     this._wavesLedger = new WavesLedgerSync(this._ledgerConfig);

        //     return this._wavesLedger.tryConnect()
        //         .then((res) => { console.log('initWavesLedger SUCCESS'); return res; })
        //         .catch((er) => { console.log('initWavesLedger ERROR'); return er; });
        // } else {
        //     return Promise.resolve();
        // }

        if (!this._wavesLedger) {
            this._wavesLedger = new WavesLedgerSync(this._ledgerConfig);
        }

        return this._wavesLedger.tryConnect()
            .then((res) => { console.log('initWavesLedger SUCCESS', res); return res; })
            .catch((er) => { console.log('initWavesLedger ERROR', er); return er; });
    }

    private isLedgerConnected(): boolean {
        return this._wavesLedger !== null;
    }

    private async loginFlow() {
        this.__log('loginFlow');

        connectionDialog();

        // todo sleep
        await new Promise((resolve, reject) => { setTimeout(resolve, 1000)});

        // if (this.user === null) {
        //     this.login();
        // }

        closeDialog();

        // return this.initWavesLedger()
        return this.login()
            // .then((res) => {
            //     closeDialog();
            //     console.log('Login flow SUCCESS', res);
            // })
            .catch((er) => {
                closeDialog();
                showConnectionError(() => { console.log('Login reconnect'); closeDialog();});
                console.log('Login flow ERROR', er);
            });
    }

    private __log(tag: string, ...args) {
        if (this._providerConfig.debug) {
            console.log(`ProviderLedger :: ${tag} `, ...args);
        }
    }
}

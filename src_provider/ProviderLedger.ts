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
    showConnecting as showConnectionDialog,
    showConnectionError as showConnectionErrorDialog,
    getUser as showGetUserDialog,
    signTx as showSignTxDialog,
    closeDialog,
} from "./ui";
import {
    IProviderLedgerConfig,
    ProviderSignedTx,
} from './ProviderLedger.interface';
import { takeLastWhile, then } from 'ramda';

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
    private _ledgerConfig: IWavesLedgerConfig;

    private _wavesLedger: WavesLedgerSync | null = null;
    private _wavesLedgerConnection: any | null = null;
    private _isWavesAppReady: boolean = false;
    private _isWavesAppReadyPromise: Promise<boolean> | null = null;

    public user: IUser | null = null;

    constructor(config?: IProviderLedgerConfig) {
        this._providerConfig = config || DEFAULT_PROVIDER_CONFIG;
        this._ledgerConfig = config?.wavesLedgerConfig || DEFAULT_WAVES_LEDGER_CONFIG;

        this.__log('constructor');
    }

    public sign(
        list: Array<SignerTx>
    ): Promise<Array<ProviderSignedTx>> {
        this.__log('sign', list);

        if (this.user === null) {
            return this.login()
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

                closeDialog();
                showSignTxDialog(tx);

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
        if(!this.isLedgerInited() || !this._isWavesAppReady) {
            closeDialog();
            showConnectionDialog();

            return this.initWavesLedger()
                .then(() => {
                    return this.awaitingWavesApp()
                        .then((ready) => {

                            if(!ready) {
                                closeDialog();
                                showConnectionErrorDialog(() => {
                                    return this.login();
                                });

                                throw 'Provider login awaiting error';
                            } else {
                                return this.login();
                            }
                        });
                });
        }

        this.__log('login');

        closeDialog();
        return showGetUserDialog(this._wavesLedger!)
            .then((user) => {
                this.user =  user;

                this.__log('login :: user');
                return (user as UserData);
            });
    }

    public logout(): Promise<void> {
        this.__log('logout');

        this.user = null;

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

    private async initWavesLedger(): Promise<null> {
        this.__log('initWavesLedger');

        if (!this._wavesLedger) {
            this._wavesLedger = new WavesLedgerSync(this._ledgerConfig);
        }

        if(this._wavesLedgerConnection === null) {
            this._wavesLedgerConnection = await this._wavesLedger.tryConnect();
        }

        return null;
    }

    private async awaitingWavesApp(): Promise<boolean> {
        const TRY_COUNT = 3;
        const TRY_DELAY = 5;

        let count = 1;
        let isAppReady = await this.isApplicationReady();

        while(!isAppReady) {
            if (count >= TRY_COUNT) {
                return false;
            }

            count++;
            await this.sleep(TRY_DELAY);
            isAppReady = await this.isApplicationReady();
        }

        this._isWavesAppReady = true;
        return true;
    }

    private isLedgerInited(): boolean {
        return this._wavesLedger !== null;
    }

    private async isApplicationReady(): Promise<boolean> {
        if(!this._isWavesAppReadyPromise) {
            this._isWavesAppReadyPromise = this._wavesLedger!.probeDevice();
        }

        return this._isWavesAppReadyPromise!
            .then((res) => {
                this._isWavesAppReadyPromise = null;
                return res;
            });
    }

    private async sleep(seconds: number): Promise<void> {
        return new Promise((resolve, reject) => { setTimeout(resolve, seconds *1000); });
    }

    private __log(tag: string, ...args) {
        if (this._providerConfig.debug) {
            console.log(`ProviderLedger :: ${tag} `, ...args);
        }
    }
}

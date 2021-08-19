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
import { fetchNodeTime } from '@waves/node-api-js/es/api-node/utils';
import { IUser, WavesLedgerSync, IWavesLedgerConfig } from '@waves/ledger';
import { libs, makeTx, makeTxBytes, signTx } from '@waves/waves-transactions';
// import { Waves } from '@waves/ledger/lib/Waves';
import { isUserCancelError, errorUserCancel, signerTx2TxParams, sleep } from './helpers';
import {
    showConnectingDialog,
    showConnectionErrorDialog,
    showGetUserDialog,
    showSignTxDialog,
    closeDialog,
} from './ui';
import {
    EConnectingState,
    IProviderLedgerConfig,
    ProviderSignedTx,
} from './ProviderLedger.interface';

const DEFAULT_PROVIDER_CONFIG = {
    debug: false,
};

const DEFAULT_WAVES_LEDGER_CONFIG: IWavesLedgerConfig = {
    debug: false,
    openTimeout: 3000,
    listenTimeout: 30000,
    exchangeTimeout: 30000,
    networkCode: 87,
    transport: HwTransportWebusb
};

export class ProviderLedger implements Provider {
    private _connectingState: EConnectingState;
    private _providerConfig: IProviderLedgerConfig;
    // todo connect to network
    private _options: ConnectOptions = {
        NETWORK_BYTE: 'W'.charCodeAt(0),
        NODE_URL: 'https://nodes.wavesplatform.com',
    };
    private _ledgerConfig: IWavesLedgerConfig;

    private _wavesLedger: WavesLedgerSync | null = null;
    private _wavesLedgerConnection: any | null = null;
    private _isWavesAppReadyPromise: Promise<boolean> | null = null;

    public user: IUser | null = null;

    constructor(config?: IProviderLedgerConfig) {
        this._connectingState = EConnectingState.CONNECT_LEDGER;
        this._providerConfig = config || DEFAULT_PROVIDER_CONFIG;
        this._ledgerConfig = config?.wavesLedgerConfig || DEFAULT_WAVES_LEDGER_CONFIG;

        this._loadFonts();
        this.__log('constructor');
    }

    public async login(): Promise<UserData> {
        this.__log('login');

        if(this.user) {
            return this.user;
        }

        this._connectingState = EConnectingState.CONNECT_LEDGER;
        closeDialog();
        if(this.isLedgerInited()) {
            //
        } else {
            showConnectingDialog(() => this.getConnectionState());
            try { await this.initWavesLedger(); } catch (er) { console.error('login :: initWavesLedger', er); }
        }

        this._connectingState = EConnectingState.OPEN_WAVES_APP;
        const isWavesAppReady = await this.isWavesAppReady();

        if(isWavesAppReady) {
            //
        } else {
            showConnectingDialog(() => this.getConnectionState());
            let isReady: boolean = false;
            try { isReady = await this.awaitingWavesApp(); } catch (er) { console.error('login :: isWavesAppReady', er); }

            if (!isReady) {
                closeDialog();
                await showConnectionErrorDialog();
                return this.login();
            }
        }

        this._connectingState = EConnectingState.READY;
        return this._login();
    }

    public logout(): Promise<void> {
        this.__log('logout');

        this.user = null;

        return Promise.resolve();
    }

    public async sign(list: Array<SignerTx>): Promise<Array<ProviderSignedTx>> {
        this.__log('sign', list);

        const isWavesAppReady = await this.isWavesAppReady();

        if (!isWavesAppReady || this.user === null) {
            await this.login();
        }

        return this._sign(list)
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

    private _login(): Promise<UserData> {
        this.__log('_login');

        closeDialog();
        return showGetUserDialog(this._wavesLedger!)
            .then((user) => {
                this.user =  user;

                this.__log('login :: user', this.user);
                return (user as UserData);
            });
    }


    private async _sign(list: Array<SignerTx>): Promise<Array<ProviderSignedTx>> {
        this.__log('_sign', list);

        const nodeTime = (await fetchNodeTime(this._options.NODE_URL)).NTP;

        const promiseList = Promise.all(
            list.map((tx: SignerTx): Promise<any> => {
                const publicKey: string = this.user!.publicKey;
                const sender: string = this.user!.address;

                const tx4ledger = signerTx2TxParams(tx);

                /* TODO Magic fields for signTx */
                tx4ledger.timestamp = nodeTime;
                tx4ledger.senderPublicKey = publicKey;
                tx4ledger.chainId = this._ledgerConfig.networkCode;

                const signedTx = signTx(tx4ledger as any, 'dummy') as any; // TODO typing

                tx4ledger.id = signedTx.id; // todo

                const dataBuffer = makeTxBytes({
                    ...tx4ledger,
                    senderPublicKey: publicKey,
                });

                closeDialog();
                showSignTxDialog({
                    ...tx4ledger,
                    sender: sender
                }, this.user!); // we must have user when try to sign tx

                const data2sign = {
                    dataType: tx4ledger.type,
                    dataVersion: tx4ledger.version,
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
                            // original
                            ...tx4ledger,
                            ...tx,
                            proofs: proofs
                        };

                        closeDialog();

                        this.__log('sign :: signed tx', signedTx);
                        return signedTx;
                    })
                    .catch((er) => {
                        if (er && isUserCancelError(er.statusCode)) {
                            closeDialog();
                            throw errorUserCancel();
                        } else {
                            throw er;
                        }
                    });
            })
        ) as any;

        return promiseList;
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
        const TRY_COUNT = 15;
        const TRY_DELAY = 1;

        let count = 1;
        let isAppReady = await this.isWavesAppReady();

        while(!isAppReady) {
            if (count >= TRY_COUNT) {
                return false;
            }

            count++;
            await sleep(TRY_DELAY);
            isAppReady = await this.isWavesAppReady();
        }

        return true;
    }

    private isLedgerInited(): boolean {
        return this._wavesLedger !== null;
    }

    private async isWavesAppReady(): Promise<boolean> {
        if(!this._isWavesAppReadyPromise) {
            try {
                this._isWavesAppReadyPromise = this._wavesLedger!.probeDevice();
            } catch (er) {
                return Promise.resolve(false);
            }
        }

        return this._isWavesAppReadyPromise!
            .then((res) => {
                this._isWavesAppReadyPromise = null;
                return res;
            })
            .catch((er) => {
                this._isWavesAppReadyPromise = null;
                return false;
            });
    }

    private getConnectionState(): EConnectingState {
        return this._connectingState;
    }

    private _loadFonts() {
        try {
            const url = 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';
            const linkEl = document.createElement('link');

            linkEl.rel = 'stylesheet';
            linkEl.href = url;
            linkEl.onload = () => {
                this.__log('_loadFonts :: loaded');
                // const spanEl = document.createElement('span');
                // spanEl.innerText = ' ';
                // spanEl.style.fontFamily = '"Roboto", sans-serif';
                // spanEl.style.fontStyle = 'normal';
                // spanEl.style.fontWeight = 'normal';

                // document.querySelector('body')!.appendChild(spanEl);
            }

            document.querySelector('head')!.appendChild(linkEl);
        } catch (er) {
            this.__log('_loadFonts :: fail');
        }
    }

    private __log(tag: string, ...args) {
        if (this._providerConfig.debug) {
            console.log(`ProviderLedger :: ${tag} `, ...args);
        }
    }
}

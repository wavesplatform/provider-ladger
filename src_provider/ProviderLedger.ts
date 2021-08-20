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
// import { fetchBalanceDetails } from '@waves/node-api-js/es/api-node/addresses';

import { IUser, WavesLedgerSync, IWavesLedgerConfig } from '@waves/ledger';
import { makeTxBytes, signTx } from '@waves/waves-transactions';
// import { Waves } from '@waves/ledger/lib/Waves';
import { ENetworkCode } from './interface';
import { getNodeBaseUrl, isUserCancelError, errorUserCancel, signerTx2TxParams, sleep } from './helpers';
import { promiseWrapper } from './utils';
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
    private _ledgerRequestsCount: number = 0;
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

        await this.insureWavesAppReady();

        if(this.user) {
            return this.user;
        }

        return this._login();
    }

    public logout(): Promise<void> {
        this.__log('logout');

        this.user = null;

        return Promise.resolve();
    }

    public async sign(list: Array<SignerTx>): Promise<Array<ProviderSignedTx>> {
        this.__log('sign', list);

        await this.insureWavesAppReady();

        if (this.user === null) {
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
            list.map(async (tx: SignerTx): Promise<any> => {
                let ledgerSignPromiseWrapper;

                const publicKey: string = this.user!.publicKey;
                const sender: string = this.user!.address;

                const networkCode = this._ledgerConfig.networkCode as ENetworkCode;
// console.log(networkCode);
                // const assetsBalance = await fetchBalanceDetails(getNodeBaseUrl(networkCode), sender);
                const balance = 0;
// console.log('BALANCE', networkCode, assetsBalance);
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
                    },
                    this.user!, // we must have user when try to sign tx,
                    balance,
                    () => { ledgerSignPromiseWrapper.reject(errorUserCancel()) }
                );

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

                this._ledgerRequestsCount += 1;

                const signTxPromise = this._wavesLedger!.signTransaction(this.user!.id, data2sign);

                signTxPromise
                    .then(() => this._ledgerRequestsCount -= 1)
                    .catch(() => this._ledgerRequestsCount -= 1);

                ledgerSignPromiseWrapper = promiseWrapper(signTxPromise);

                return ledgerSignPromiseWrapper.promise
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
                        closeDialog();

                        if (er && isUserCancelError(er.statusCode)) {
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

    private async insureWavesAppReady(): Promise<boolean> {
        this._connectingState = EConnectingState.CONNECT_LEDGER;

        closeDialog();

        if(this._ledgerRequestsCount > 0) {
            await showConnectionErrorDialog();
            return this.insureWavesAppReady();
        }

        if(this.isLedgerInited()) {
            //
        } else {
            showConnectingDialog(() => this.getConnectionState());
            try { await this.initWavesLedger(); } catch (er) { console.error('login :: initWavesLedger', er); }
        }

        this._connectingState = EConnectingState.OPEN_WAVES_APP;
        const isAppReady = await this.isWavesAppReady();

        if(isAppReady) {
            this._connectingState = EConnectingState.READY;
            return true;
        } else {
            showConnectingDialog(() => this.getConnectionState());
            let isReady: boolean = false;
            isReady = await this.awaitingWavesApp();

            if (!isReady) {
                closeDialog();
                await showConnectionErrorDialog();
                return this.insureWavesAppReady();
            } else {
                return true;
            }
        }
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

    private isWavesAppReady(): Promise<boolean> {

        if (this._wavesLedger === null) {
            return Promise.resolve(false);
        }

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

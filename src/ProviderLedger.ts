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
import { fetchCalculateFee } from '@waves/node-api-js/es/api-node/transactions';
import { fetchNodeTime } from '@waves/node-api-js/es/api-node/utils';
import { fetchBalanceDetails } from '@waves/node-api-js/es/api-node/addresses';
import { fetchAssetsDetails } from '@waves/node-api-js/es/api-node/assets';
import { IUser, WavesLedgerSync, IWavesLedgerConfig } from '@waves/ledger';
import { makeTxBytes, signTx, serializeCustomData, libs } from '@waves/waves-transactions';
import { TRANSACTION_TYPE } from '@waves/ts-types';
import {
	isUserCancelError,
	signerTx2TxParams,
	getAssetInfoUrl,
	WAVES_DECIMALS,
	cleanTx,
	makeLedgerHashFromString,
} from './helpers';
import {
	errorUserCancel,
	isSupportedBrowser,
	promiseWrapper,
	sleep
} from './utils';
import {
	showBrowserNotSupportedDialog,
	showConnectingDialog,
	showConnectionErrorDialog,
	showLoginDialog,
	showSignMessageDialog,
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
	// networkCode: ENetworkCode.MAINNET, // get from ProviderLedger.connect params
	transport: HwTransportWebusb
};

export class ProviderLedger implements Provider {
	private _connectingState: EConnectingState;
	private _ledgerRequestsCount: number = 0;
	private _providerConfig: IProviderLedgerConfig;
	// todo connect to network
	private _options?: ConnectOptions;
	private _ledgerConfig: IWavesLedgerConfig;

	private _wavesLedger: WavesLedgerSync | null = null;
	private _wavesLedgerConnection: any | null = null;
	private _isWavesAppReadyPromise: Promise<boolean> | null = null;

	public user: IUser | null = null;

	constructor(config?: IProviderLedgerConfig) {
		this._connectingState = EConnectingState.CONNECT_LEDGER;
		this._providerConfig = config || DEFAULT_PROVIDER_CONFIG;
		this._ledgerConfig = {
			...DEFAULT_WAVES_LEDGER_CONFIG,
			...config?.wavesLedgerConfig
		};

		if (config?.wavesLedgerConfig?.networkCode) {
			console.warn('[Deprecated] wavesLedgerConfig.networkCode is deprecated. networkCode will fetch from node');
		}

		this._loadFonts();
		this.__log('constructor', config);
	}

	public async login(): Promise<UserData> {
		this.__log('login');

		if (!isSupportedBrowser()) {
			closeDialog();
			showBrowserNotSupportedDialog();
			throw 'Browser not supported';
		}

		await this.insureWavesAppReady();

		if(this.user) {
			return this.user;
		}

		return this._login();
	}

	public async logout(): Promise<void> {
		this.__log('logout');

		this.user = null;
		this.__log('logout : success');
	}

	public async sign(list: Array<SignerTx>): Promise<Array<ProviderSignedTx>> {
		this.__log('sign', list);

		if (!isSupportedBrowser()) {
			closeDialog();
			showBrowserNotSupportedDialog();
			throw 'Browser not supported';
		}

		await this.insureWavesAppReady();

		if (this.user === null) {
			await this.login();
		}

		list.forEach(cleanTx); // todo make clean function

		return this._sign(list)
	}

	public signTypedData(data: Array<TypedData>): Promise<string> {
		this.__log('signTypedData');

		console.error('Not implemented');
		return Promise.resolve('/* TODO */');
	}

	public async signMessage(data: string | number): Promise<string> {
		this.__log('signMessage', data);

		await this.insureWavesAppReady();

		if (this.user === null) {
			await this.login();
		}

		return this._signMessage(data);
	}

	public connect(options: ConnectOptions): Promise<void> {
		this.__log('connect', options);

		this._options = options;
		this._ledgerConfig.networkCode = this._options!.NETWORK_BYTE;

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
		return showLoginDialog(this._wavesLedger!)
			.then((user) => {
				this.user =  user;

				this.__log('login :: user', this.user);
				return (user as UserData);
			});
	}


	private async _sign(list: Array<SignerTx>): Promise<Array<ProviderSignedTx>> {
		this.__log('_sign', list);

		const publicKey: string = this.user!.publicKey;
		const senderAddress: string = this.user!.address;
		const nodeUrl = this._options!.NODE_URL;

		const nodeTime = await fetchNodeTime(nodeUrl);
		const balanceDetails = await fetchBalanceDetails(nodeUrl, senderAddress);

		const promiseList = Promise.all(
			list.map(async (tx: SignerTx): Promise<any> => {
				let ledgerSignPromiseWrapper;

				const tx4ledger = signerTx2TxParams(tx);
				const assetdDetails = await this.getAssetsDetails(tx);
				const paymentsPrecision = this.getAmountPrecission(tx, assetdDetails);

				/* TODO Magic fields for signTx */
				tx4ledger.timestamp = nodeTime.NTP;
				tx4ledger.senderPublicKey = publicKey;
				tx4ledger.chainId = this._options!.NETWORK_BYTE;

				if (!tx4ledger.fee) {
					const feeInfo = await fetchCalculateFee(this._options!.NODE_URL, tx4ledger as any);
					tx4ledger.fee = feeInfo.feeAmount;
				}

				const signedTx = signTx(tx4ledger as any, 'dummy') as any; // TODO typing

				tx4ledger.id = signedTx.id; // todo

				const dataBuffer = makeTxBytes({
					...tx4ledger,
					senderPublicKey: publicKey,
				});

				closeDialog();
				showSignTxDialog({
						...tx4ledger,
						sender: senderAddress
					},
					this.user!,
					assetdDetails,
					balanceDetails.available,
					() => { ledgerSignPromiseWrapper.reject(errorUserCancel()) }
				);

				const data2sign = {
					dataType: tx4ledger.type,
					dataVersion: tx4ledger.version,
					dataBuffer: dataBuffer,
					amountPrecision: paymentsPrecision[0],
					amount2Precision: paymentsPrecision[1],
					feePrecision: WAVES_DECIMALS,
				};

				this._ledgerRequestsCount += 1;

				this.__log('_sign :: ledger', this.user!.id, data2sign);
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

		// return promiseList;
		// TODO remove this crutch
		return promiseList
			.then((list) => {
				return list[0];
			});
	}

	// should it be signSome data ?
	public async _signMessage(data: string | number): Promise<string> {
		this.__log('_signMessage', data);

		const senderAddress: string = this.user!.address;
		const balanceDetails = await fetchBalanceDetails(this._options!.NODE_URL, senderAddress);

		closeDialog();
		showSignMessageDialog(
			makeLedgerHashFromString(data),
			this.user!,
			balanceDetails.available,
			() => { ledgerSignPromiseWrapper.reject(errorUserCancel()) }
		);

		const msgBytes = libs.crypto.stringToBytes(String(data));
		const base64 = 'base64:' + libs.crypto.base64Encode(msgBytes);

		const bytes = serializeCustomData({
			binary: base64,
			version: 1,
		});

		const data4sign = {
			dataBuffer: bytes
		};

		this.__log('_signMessage :: ledger', this.user!.id, data4sign);
		const signDataPromise = this._wavesLedger!.signSomeData(this.user!.id, data4sign);

		let ledgerSignPromiseWrapper = promiseWrapper(signDataPromise);

		ledgerSignPromiseWrapper.promise
			.then(() => closeDialog())
			.catch(() => closeDialog());

		return ledgerSignPromiseWrapper.promise;
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
			try {
				await this.initWavesLedger();
			} catch (er) {
				console.error('initWavesLedger : error', er);
			}
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
		const TRY_COUNT = 30;
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

	private async getAssetsDetails(tx: any): Promise<any> {
		let list: string[] = [];

		if (tx.payment) {
			list = tx.payment
				.filter(item => item.assetId !== null)
				.map(item => item.assetId);
		}

		if (tx.assetId) {
			list.push(tx.assetId);
		}

		let res: any = await fetchAssetsDetails(this._options!.NODE_URL, list);
		let assetsDetails;

		if (res[0] && res[0].assetId) {
			assetsDetails = res.map((details) => {
				return {
					...details,
					assetInfoUrl: getAssetInfoUrl(this._options!.NETWORK_BYTE!, details.assetId)
				};
			})
		}

		return assetsDetails;
	}

	// todo rework
	private getAmountPrecission(tx: any, assetdDetails: any) {
		const precission = [0, 0];
		const payment = tx.payment;

		if (tx.type === TRANSACTION_TYPE.TRANSFER) {
			const assetId = tx.assetId;

			if (assetId == null) {
				precission[0] = WAVES_DECIMALS;
			} else {
				const assetDetail = assetdDetails.find(details => details.assetId === assetId);

				precission[0] = assetDetail.decimals;
			}
		} else if (tx.type == TRANSACTION_TYPE.INVOKE_SCRIPT) {
			if (payment?.length) {
				for(let i = 0; i < payment.length; i++) {
					const assetId = payment[i].assetId;

					if (assetId == null) {
						precission[i] = WAVES_DECIMALS;
					} else {
						const assetDetail = assetdDetails.find(details => details.assetId === assetId);
						precission[i] = assetDetail.decimals;
					}
				}
			}
		}

		return precission;
	}

	private _loadFonts() {
		try {
			const url = 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';
			const linkEl = document.createElement('link');

			linkEl.rel = 'stylesheet';
			linkEl.href = url;
			linkEl.onload = () => {
				this.__log('_loadFonts :: loaded');
			}

			document.querySelector('head')!.appendChild(linkEl);
		} catch (er) {
			this.__log('_loadFonts :: fail');
		}
	}

	private __log(tag: string, ...args) {
		if (this._providerConfig.debug) {
			console.log(`ProviderLedger :: ${tag}${args.length ? ' : ' : ''}`,  ...args);
		}
	}
}

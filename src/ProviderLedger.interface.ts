import { IWavesLedgerConfig } from '@waves/ledger';
// import { IWithId } from '@waves/ts-types';
import {
	SignerTx,
	SignedTx,
} from '@waves/signer';

export enum EConnectingState {
	CONNECT_LEDGER = 1,
	OPEN_WAVES_APP = 2,
	READY = 3
};

export interface IProviderLedgerConfig {
	debug?: boolean;
	wavesLedgerConfig?: IWavesLedgerConfig;
};

type TLong = any;

export type ProviderSignedTx = SignedTx<SignerTx>;
// export type ProviderSignedTx = SignedTx<TLong> & IWithId;

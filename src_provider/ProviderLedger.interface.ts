import { IWavesLedgerConfig } from '@waves/ledger';
import { IWithId } from '@waves/ts-types';
import {
    SignerTx,
    SignedTx,
} from '@waves/signer';

export interface IProviderLedgerConfig {
    debug?: boolean;
    wavesLedgerConfig?: IWavesLedgerConfig;
};

type TLong = any;

export type ProviderSignedTx = SignedTx<SignerTx>;
// export type ProviderSignedTx = SignedTx<TLong> & IWithId;

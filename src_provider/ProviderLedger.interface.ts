import { IWavesLedgerConfig } from '@waves/ledger';

export interface IProviderLedgerConfig {
    debug?: boolean;
    wavesLedgerConfig?: IWavesLedgerConfig;
};

import {
    SignerTx,
} from '@waves/signer';

import { ITransferParams, IInvokeScriptParams, WithSender, WithId } from '@waves/waves-transactions';

// type TxParams = ITransferParams | IInvokeScriptParams;
type ISignerTx2TxParams = ITransferParams & { type: TTxType, version: number } & WithId;
type TTxType = 4 | 16;

export const signerTx2TxParams = (signerTx: SignerTx): ISignerTx2TxParams => {
    let tx;

    switch (signerTx.type) {
        case 4:
            tx = {
                version: 2, // todo check default version
                // default values
                // timestamp: nodeTime.NTP,
                fee: 500000, // todo from node
                attachment: "",
                // 
                ...signerTx,
                type: (signerTx.type as TTxType), // todo
            };
            break;
        case 16:
            tx = {
                version: 2, // todo check default version
                // timestamp: nodeTime.NTP,
                fee: 500000, // todo from node
                // feeAssetId: null,
                ...signerTx,
                type: (signerTx.type as TTxType), // todo
            };
            break;
        default:
            throw "Unsupported tx type"
    }

    return tx;
};

export const sleep = (seconds: number): Promise<void> => {
    return new Promise((resolve, reject) => { setTimeout(resolve, seconds *1000); });
};

export const isUserCancelError = (code: number) => {

    // https://github.com/wavesplatform/ledger-app-waves/wiki/Integration-manual
    // SW_OK 0x9000
    // SW_USER_CANCELLED 0x9100
    // SW_SIGN_DATA_NOT_MATCH 0x9101
    // SW_DEPRECATED_SIGN_PROTOCOL 0x9102
    // SW_INCORRECT_PRECISION_VALUE 0x9103
    // SW_INCORRECT_TRANSACTION_TYPE_VERSION 0x9104
    // SW_PROTOBUF_DECODING_FAILED 0x9105
    // SW_CONDITIONS_NOT_SATISFIED 0x6985
    // SW_BUFFER_OVERFLOW 0x6990
    // SW_INCORRECT_P1_P2 0x6A86
    // SW_INS_NOT_SUPPORTED 0x6D00
    // SW_CLA_NOT_SUPPORTED  0x6E00
    // SW_SECURITY_STATUS_NOT_SATISFIED 0x6982

    return parseInt('0x9100', 16) === code;
};

export const errorUserCancel = () => {
    return new Error('User rejection!')
}

export const txCall2string = (call: any) => {
    const func = call.function;
    const args = call.args
        .map((arg: any): string => {
            const value = arg.value;

            if (typeof value === 'string') {
                return String(`"${value}"`);
            } else {
                return String(value);
            }
        })
        .join(', ');

    return `${func}(${args})`;
}

const DEFAULT_ASSET_ID = 'WAVES';
export const getAssetId = (assetId: any) => {
    return assetId == null ? DEFAULT_ASSET_ID : assetId;
};

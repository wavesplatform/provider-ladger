import {
    SignerTx,
} from '@waves/signer';

import { ITransferParams, IInvokeScriptParams, WithSender, WithId } from '@waves/waves-transactions';

import {
    waves
} from './waves';

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
                fee: 500000,
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
                fee: 500000,
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

export const cleanTx = (tx: any) => {
    if (tx.type === 4) {
        if (tx.assetId === waves.WAVES_SYMBOL) {
            tx.assetId = null;
        }
    } else if (tx.type === 16) {
        if (tx.assetId === waves.WAVES_SYMBOL) {
            tx.assetId = null;
        }

        if (tx.payment) {
            tx.payment.forEach((item) => {
                if (item.assetId === waves.WAVES_SYMBOL) {
                    item.assetId = null;
                }
            });
        }
    }
}

const primitive2view = (value: boolean | number | string | any) => {
    if (typeof value === 'string') {
        return String(`"${value}"`);
    } else {
        return String(value);
    }
}

const arg2view = (arg: { type: string, value: any }) => {
    if (arg.type === 'list') {
        return `[${arg.value.map(arg2view)}]`;
    } else {
        return primitive2view(arg.value);
    }
}

export const txCall2string = (call: any) => {
    const func = call.function;
    const args = call.args
        .map(arg2view)
        .join(', ');

    return `${func}(${args})`;
}

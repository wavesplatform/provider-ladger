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

export const sleep = (seconds: number): Promise<void> => {
    return new Promise((resolve, reject) => { setTimeout(resolve, seconds *1000); });
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

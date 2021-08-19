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
                version: 1, // todo check default version
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

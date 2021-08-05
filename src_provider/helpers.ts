import {
    SignerTx,
} from '@waves/signer';
import { ITransferParams, IInvokeScriptParams, WithSender } from '@waves/waves-transactions';

type TxParams = ITransferParams | IInvokeScriptParams;
type TTxType = 4 | 16;

export const signerTx2TxParams = (signerTx: SignerTx): ITransferParams & { type: TTxType, version: number } => {
    let tx;

    switch (signerTx.type) {
        case 4:
            tx = {
                // default values
                timestamp: Date.now(),
                fee: 500000, // todo from node
                attachment: "",
                version: 2, // todo check default version
                // 
                ...signerTx,
                type: (signerTx.type as TTxType), // todo
            };
            break;
        case 16:
            tx = {
                timestamp: Date.now(),
                fee: 500000, // todo from node
                feeAssetId: null,
                version: 2, // todo check default version
                ...signerTx,
                type: (signerTx.type as TTxType), // todo
            };
            break;
        default:
            throw "Unsupported tx type"
    }

    return tx;
};

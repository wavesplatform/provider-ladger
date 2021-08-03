import {
    SignerTx,
} from '@waves/signer';
import { ITransferParams, IInvokeScriptParams, WithSender } from '@waves/waves-transactions';

type TxParams = ITransferParams | IInvokeScriptParams;
type TTxType = 4 | 16;

export const signerTx2TxParams = (signerTx: SignerTx): ITransferParams & { type: TTxType, version: number }=> {
    let tx;

    switch (signerTx.type) {
        case 4:
            tx = {
                // default values
                timestamp: Date.now(),
                fee: 1,
                attachment: "",
                version: 2,
                // 
                ...signerTx,
                type: (signerTx.type as TTxType), // todo
            };
            break;
        case 16:
            tx = {
                version: 2,
                ...signerTx,
                type: (signerTx.type as TTxType), // todo
            };
            break;
        default:
            throw "Unsupported tx type"
    }

    return tx;
};

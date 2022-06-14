import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import { preload, toQueue } from './helpers';
import ledgerService from '../services/ledgerService';
import {transfer, libs} from '@waves/waves-transactions'
export const getSignHandler = (queue: Queue, state: IState): any =>{
    return toQueue(queue, (list: any) => {
        preload();
        const tx = list[0];
        const transferTx = transfer(tx);
        const bytes = libs.marshall.binary.serializeTx(transferTx);
        return ledgerService.instance!.signData(bytes).then((proof) => {
            transferTx.proofs = [proof]
            return transferTx
        });

    });}



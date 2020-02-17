import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import { TLong, TTransactionParamWithType } from '@waves/signer';
// import batchPage from '../pages/batch';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import { libs, signTx } from '@waves/waves-transactions';
import { IUser } from '../../interface';
import { ITransactionInfo } from '../services/transactionsService';
import Button from '../components/Button';
import React from 'react';

export default function(
    list: Array<ITransactionInfo<TTransactionParamWithType>>,
    state: IState<IUser>
): Promise<Array<TTransactionWithProofs<TLong> & IWithId>> {
    return new Promise((resolve, reject) => {
        renderPage(
            <Button>Click me</Button>
        );
    });
}

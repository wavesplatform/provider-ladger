import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import { TLong, TRANSACTION_TYPE_MAP, TTransactionParamWithType, } from '@waves/signer';
import { libs, signTx } from '@waves/waves-transactions';
import React, { ReactNode } from 'react';
import { NAME_MAP } from '../constants';
import { ISignTxProps, IUserWithBalances } from '../../interface';
import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import batch from './batch';
import omit from 'ramda/es/omit';
import { Button } from '../components/Button';

const SignTransfer = () => <Button>Click me</Button>

const getPageByType = (type: keyof TRANSACTION_TYPE_MAP): ReactNode => {
    switch (type) {
        case NAME_MAP.transfer:
            return SignTransfer;
        case NAME_MAP.invoke:
            throw new Error('Unsupported type!'); // TODO
        // return SignInvoke;
        case NAME_MAP.data:
            throw new Error('Unsupported type!'); // TODO
        // return SignDataContainer;
        case NAME_MAP.issue:
            throw new Error('Unsupported type!'); // TODO
        // return SignIssueContainer;
        case NAME_MAP.exchange:
            throw new Error('Unsupported type!'); // TODO
        case NAME_MAP.lease:
            throw new Error('Unsupported type!'); // TODO
        // return SignLease;
        case NAME_MAP.cancelLease:
            throw new Error('Unsupported type!'); // TODO
        // return SignCancelLease;
        case NAME_MAP.alias:
            throw new Error('Unsupported type!'); // TODO
        // return SignAliasContainer;
        case NAME_MAP.massTransfer:
            throw new Error('Unsupported type!'); // TODO
        case NAME_MAP.setScript:
            throw new Error('Unsupported type!'); // TODO
        // return SignSetAccountScript;
        case NAME_MAP.sponsorship:
            throw new Error('Unsupported type!'); // TODO
        // return SignSponsorship;
        case NAME_MAP.setAssetScript:
            throw new Error('Unsupported type!'); // TODO
        // return SignSetAssetScriptContainer;
        case NAME_MAP.burn:
            throw new Error('Unsupported type!'); // TODO
        // return SignBurnContainer;
        case NAME_MAP.reissue:
            throw new Error('Unsupported type!'); // TODO
        // return SignReissueContainer;
        default:
            throw new Error('Unsupported transaction!');
    }
};

export default function (
    list: Array<TTransactionParamWithType>,
    state: IState<IUserWithBalances>
): any {
    console.log(list)
}

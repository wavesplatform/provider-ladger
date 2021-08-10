import React from 'react';
// import {  WavesLedgerSync } from '@waves/ledger';
import styles from './styles.less'

export interface ISignTxComponentProps {
    // ledger: WavesLedgerSync;
    // userId: number;
    tx: any,
    // onSign: () => void;
}

// interface ISignTxComponentState {
// }

export class SignTxComponent extends React.Component<ISignTxComponentProps> {

    render() {
        const { tx } = this.props;

        return (
            <div className={styles.container}>
                <textarea className={styles.jsonpreview}>
                    {this.getJsonPreview(tx)}
                </textarea>
            </div>
        );
    }

    getJsonPreview(json: any) {
        return JSON.stringify(json, null, ' ');
    }
}

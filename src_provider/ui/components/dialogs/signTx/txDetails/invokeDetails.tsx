import React from 'react';

import {
    Box,
    Text
} from '../../../../ui-kit'; // todo ui-kit

import {
    txCall2string,
    getAssetId
} from '../../../../../helpers'

import styles from './styles.less'

export interface IInvokeDetailsProps {
    tx: any; // todo tx type
};

export class InvokeDetails extends React.Component<IInvokeDetailsProps> {

    render() {
        const { tx } = this.props;

        return (
            <Box className={styles.container} col>
                {
                    (
                        tx.recipient && (<>
                        <Text label className={styles.label}>Recipient</Text>
                        <Text className={styles.value}>{tx.recipient}</Text>
                        </>)
                    )
                }
                <Text label className={styles.label}>dApp</Text>
                <Text className={styles.value}>{tx.dApp}</Text>
                <Text label className={styles.label}>Function</Text>
                <Text className={styles.value}>{txCall2string(tx.call)}</Text>
                <Text label className={styles.label}>Payments</Text>
                {this.getPayments()}
                <Text label className={styles.label}>Fee</Text>
                <Text className={styles.value}>{tx.fee} WAVES</Text>
            </Box>
        );
    }

    getPayments() {
        const { tx } = this.props;

        return tx.payment
            .map((payment) => {
                return (<Text className={styles.value}>{payment.amount} {getAssetId(payment.assetId)}</Text>);
            });
    }

}

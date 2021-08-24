import React from 'react';

import {
    Box,
    Text,
    Hash,
} from '../../../../ui-kit'; // todo ui-kit

import {
    txCall2string,
    waves,
} from '../../../../../helpers'

import styles from './styles.less'

export interface IInvokeDetailsProps {
    assetsDetails: any;
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
                <Text className={styles.value}>{waves.amountView(tx.fee)} WAVES</Text>
            </Box>
        );
    }

    getPayments() {
        const { tx, assetsDetails } = this.props;

        return tx.payment
            .map((payment) => {
                let amount: any;
                let name: string | any;
                let amountComponent;

                if (payment.assetId == null || payment.assetId == waves.WAVES_SYMBOL) {
                    amount = waves.amountView(payment.amount);
                    name = waves.WAVES_SYMBOL;

                    amountComponent = (<Text className={styles.value}>{amount} {name}</Text>);
                } else {
                    const details = assetsDetails.find((details) => {
                        return details.assetId == payment.assetId;
                    });

                    amount = waves.amountView(payment.amount, details.decimals);
                    name = (<a href={details.assetInfoUrl} target='_blank'>{details.name}</a>);

                    amountComponent = (
                        <Text className={styles.value}>
                            <span>{amount} {name}</span>&nbsp;&nbsp;
                            <Text label>(id: <Hash hash={payment.assetId} short/>)</Text>
                        </Text>
                    );
                }

                return amountComponent;
            });
    }

}

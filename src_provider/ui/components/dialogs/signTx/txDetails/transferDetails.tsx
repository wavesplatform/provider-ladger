import React from 'react';

import {
    Box,
    Text
} from '../../../../ui-kit'; // todo ui-kit

import {
    waves,
} from '../../../../../helpers'

import styles from './styles.less'

export interface ITransferDetailsProps {
    // assetsDetails: any;
    tx: any; // todo tx type
};

export class TransferDetails extends React.Component<ITransferDetailsProps> {

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
                <Text label className={styles.label}>Fee</Text>
                <Text className={styles.value}>{waves.format(tx.fee)} WAVES</Text>
                <Text label className={styles.label}>Amount</Text>
                <Text className={styles.value}>{tx.amount}</Text>
                <Text label className={styles.label}>Attachment </Text>
                <Text className={styles.value}>{tx.attachment}</Text>
            </Box>
        );
    }

}

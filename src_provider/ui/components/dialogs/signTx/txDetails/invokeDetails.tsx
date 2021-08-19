import React from 'react';

import {
    Box,
    Text
} from '../../../../ui-kit'; // todo ui-kit

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
                <Text label className={styles.label}>Fee</Text>
                <Text className={styles.value}>{tx.fee / 100000000} WAVES</Text>
                <Text label className={styles.label}>dApp</Text>
                <Text className={styles.value}>{tx.dApp}</Text>
                <Text label className={styles.label}>Function</Text>
                <Text className={styles.value}>{this.renderFunction()}</Text>
                <Text label className={styles.label}>Payments</Text>
                <Text className={styles.value}>{this.getPayments()}</Text>
            </Box>
        );
    }

    getPayments() {
        const { tx } = this.props;

        return tx.payment
            .map((payment) => {
                return (<Text className={styles.payment}>{payment.amount / 100000000}</Text>);
            });
    }

    renderFunction() {
        const call = this.props.tx.call;
        const func = call.function;
        const args = call.args
            .map(this.formatArg)
            .join(', ');

        return `${func}(${args})`;
    }

    formatArg(arg: any): string {
        const value = arg.value;

        if (typeof value === 'string') {
            return String(`"${value}"`);
        } else {
            return String(value);
        }
    }
}

import React from 'react';

import {
    Box,
    Button,
    Text,
    SvgCrossError,
} from '../../../ui-kit'; // todo ui-kit

import styles from './styles.less';

export interface IConnectionErrorProps {
    onReconnect: () => void
}

interface IConnectionErrorState {}

export class ConnectionErrorComponent extends React.Component<IConnectionErrorProps, IConnectionErrorState> {

    render() {
        return (
            <Box className={styles.component} col>
                <Box className={styles.erroricon}><SvgCrossError /></Box>
                <Text className={styles.title} xl>Can not connect to <br />Ledger device</Text>
                <Text className={styles.subtitle} l descr>
                    Please try again
                </Text>
                <Button
                    className={styles.button}
                    onClick={this.onReconnect.bind(this)}
                >
                    Try again
                </Button>
            </Box>
        );
    }

    onReconnect() {
        this.props.onReconnect();
    }
}

import React from 'react';

import {
    Box,
    SvgLedgerLogo,
    Loader,
    Text,
} from '../../../ui-kit'; // todo module

import styles from './styles.less';

export interface IConnectingProps {};

export class ConnectingComponent extends React.Component<IConnectingProps> {
    render() {
        return (
            <Box className={styles.component} col>
                <Box className={styles.ledgerlogo}><SvgLedgerLogo /></Box>
                <Text className={styles.title} xl>Подключение...</Text>
                <Box col alignstart>
                    <Text className={styles.subtitle} m descr>- Подключите устройство Ledger</Text>
                    <Text className={styles.subtitle} m descr>- Введите ваш pin-code</Text>
                    <Text className={styles.subtitle} m descr>- Откройте приложение WAVES</Text>
                </Box>
                <Loader className={styles.loader} />
            </Box>
        );
    }
}

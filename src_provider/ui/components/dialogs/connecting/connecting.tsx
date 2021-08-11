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
                <SvgLedgerLogo />
                <Text className={styles.title} xl>Подключение...</Text>
                <Text className={styles.subtitle} l descr>Подключите устройство Ledger</Text>
                    {/* <li>Подключите устройство Ledger</li>
                    <li>Введите ваш pin-code</li>
                    <li>Откройте приложение WAVES</li> */}
                <Loader className={styles.loader} />
            </Box>
        );
    }
}

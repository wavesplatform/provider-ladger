import React from 'react';

import {
    Box,
    SvgLedgerLogo,
    Loader,
    Title,
    SubTitle
} from '../../../ui-kit'; // todo module

import styles from './styles.less';

export interface IConnectingProps {};

export class ConnectingComponent extends React.Component<IConnectingProps> {
    render() {
        return (
            <Box className={styles.component} col>
                <SvgLedgerLogo />
                <Title className={styles.title}>Подключение...</Title>
                <SubTitle className={styles.subtitle}>Подключите устройство Ledger</SubTitle>
                    {/* <li>Подключите устройство Ledger</li>
                    <li>Введите ваш pin-code</li>
                    <li>Откройте приложение WAVES</li> */}
                <Loader className={styles.loader} />
            </Box>
        );
    }
}

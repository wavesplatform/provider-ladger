import React from 'react';

import {
    Box,
    Button,
    Title,
    SvgCrossError,
    SubTitle
} from '../../../ui-kit';

import styles from './styles.less';

export interface IConnectionErrorProps {
    onReconnect: () => void
}

interface IConnectionErrorState {}

export class ConnectionErrorComponent extends React.Component<IConnectionErrorProps, IConnectionErrorState> {

    render() {
        return (
            <Box className={styles.component} col>
                <SvgCrossError />
                <Title className={styles.title}>Не удается подключиться к устройству Ledger</Title>
                <SubTitle className={styles.subtitle}>
                    Время ожидания соединения истекло<br />
                    Пожалуйста попробуйте еще раз
                </SubTitle>
                <SubTitle className={styles.subtitle}>
                    Если ошибка повторится, обратитесь к <a href="#">этой статье</a>
                </SubTitle>
                <Button
                    className={styles.button}
                    onClick={this.onReconnect.bind(this)}
                >
                    Повторить попытку
                </Button>
            </Box>
        );
    }

    onReconnect() {
        this.props.onReconnect();
    }
}

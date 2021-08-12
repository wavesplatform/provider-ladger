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
                <Text className={styles.title} xl>Не удается подключиться к устройству Ledger</Text>
                <Text className={styles.subtitle} l descr>
                    Время ожидания соединения истекло<br />
                    Пожалуйста попробуйте еще раз
                </Text>
                <Text className={styles.subtitle} l descr>
                    Если ошибка повторится, обратитесь<br /> к <a href="#">этой статье</a>
                </Text>
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

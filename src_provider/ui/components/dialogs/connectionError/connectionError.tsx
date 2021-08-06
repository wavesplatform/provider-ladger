import React from 'react';

import styles from "./styles.less";

export interface IConnectionErrorProps {
    onReconnect: () => void
}

interface IConnectionErrorState {
    // selectedUser: IUser | null;
    // userList: IUser[];
    // paginationIndex: number;
}

export class ConnectionErrorComponent extends React.Component<IConnectionErrorProps, IConnectionErrorState> {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         selectedUser: null,
    //         userList: [],
    //         paginationIndex: 0
    //     };
    // }

    render() {
        return (
            <div className={styles.container}>
                <div>Не удалось подключиться</div>
                <br />
                <button
                    className={styles.button}
                    onClick={this.onReconnect.bind(this)}
                >
                    повторить попытку
                </button>
            </div>
        );
    }

    onReconnect() {
        this.props.onReconnect();
    }
}

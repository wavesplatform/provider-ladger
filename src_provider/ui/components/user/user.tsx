import React from 'react';
import { IUser } from '@waves/ledger';
import styles from "./styles.less";

interface IUserComponentProps {
    user: IUser;
    onClick: (user: IUser) => void;
    active?: boolean;
}

export class UserComponent extends React.Component<IUserComponentProps> {

    render() {
        const { active, user } = this.props;
        return (
            <div className={[styles.container, active ? styles.active : ''].join(' ')} onClick={this.onClick.bind(this)}>
                <div className={styles.userid}>{user.id}</div>
                {/* <div className={styles.publickey}>{user.publicKey}</div> */}
                <div className={styles.address}>{user.address}</div>
            </div>
        );
    }

    onClick() {
        this.props.onClick(this.props.user);
    }
}

import React from 'react';
import cn from 'classnames';

import { IUser } from '@waves/ledger';

import {
    Box,
    Hash,
    IdentityImg,
    Text
} from '../../ui-kit';
import styles from './styles.less';

interface IUserComponentProps {
    user: IUser;
    onClick?: (user: IUser) => void;
    latest?: boolean;
    short?: boolean;
}

export class UserComponent extends React.Component<IUserComponentProps> {

    render() {
        const { latest, user, short } = this.props;

        return (
            <Box className={cn(styles.component)} onClick={() => this.onClick()}>
                <IdentityImg  className={styles.avatar} hash='' />
                <Box col alignstart>
                    <Box>
                        <Text s label>Мой адрес {user.id}</Text>&nbsp;&nbsp;
                        { latest ? <Text s second>Последний</Text> : null }
                    </Box>
                    <Text><Hash hash={user.address} short={short} /></Text>
                </Box>
            </Box>
        );
    }

    onClick() {
        this.props.onClick && this.props.onClick(this.props.user);
    }
}

import React from 'react';
import cn from 'classnames';

import { IUser } from '@waves/ledger';

import {
    Box,
    IdentityImg,
    Text
} from '../../ui-kit';
import styles from './styles.less';

interface IUserComponentProps {
    user: IUser;
    onClick?: (user: IUser) => void;
    active?: boolean;
}

export class UserComponent extends React.Component<IUserComponentProps> {

    render() {
        const { active, user } = this.props;

        return (
            <Box className={cn(styles.component)} onClick={() => this.onClick()}>
                <IdentityImg  className={styles.avatar} hash='' />
                <Box col start>
                    <Box>
                        <Text s label>Мой адрес {user.id}</Text>&nbsp;&nbsp;
                        { active ? <Text s second>Последний</Text> : null }
                    </Box>
                    <Text>{user.address}</Text>
                </Box>
            </Box>
        );
    }

    onClick() {
        this.props.onClick && this.props.onClick(this.props.user);
    }
}

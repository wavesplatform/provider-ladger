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
				<IdentityImg  className={styles.avatar} hash={user.address} />
				<Box col alignstart>
					<Box>
						<Text className={styles.label} s label>My address {user.id}</Text>&nbsp;&nbsp;
						{ latest ? <Text className={styles.last} s second>Last</Text> : null }
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

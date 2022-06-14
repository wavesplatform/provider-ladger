import React from 'react';
import { ButtonIconClose } from '../../ui-kit'

import styles from './styles.less';

interface IDivProps extends React.ComponentPropsWithoutRef<'div'> {
	onClose?: () => void | undefined;
}

export class Dialog extends React.Component<IDivProps> {

	render() {
		const { children, onClose } = this.props;

		return (
			<div className={styles.component}>
				{ onClose ? <ButtonIconClose className={styles.close} onClick={onClose} /> : null }
				{children}
			</div>
		);
	}
}

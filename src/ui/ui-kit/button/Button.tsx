import React from 'react';
import cn from 'classnames'

import styles from './styles.less';

interface IButtonProps extends React.ComponentPropsWithoutRef<'button'> {}

export class Button extends React.Component<IButtonProps> {

	render() {
		const { className, children, ...props } = this.props;

		return (
			<button
				className={cn(styles.component, className)}
				{...props}
			>{children}</button>
		);
	}
}

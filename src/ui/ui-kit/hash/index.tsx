import React from 'react';
import cn from 'classnames'

import styles from './styles.less';

interface IHashProps extends React.ComponentPropsWithoutRef<'span'> {
	hash: string;
	short?: boolean;
}

export class Hash extends React.Component<IHashProps> {

	render() {
		const { className, children, ...props } = this.props;

		return (
			<span className={cn(styles.component, className)}>{this.format()}</span>
		);
	}

	format() {
		const { hash, short } = this.props;

		if (short) {
			return `${hash.substr(0, 8)}***${hash.substr(-8)}`
		} else {
			return hash;
		}
		
	}
}

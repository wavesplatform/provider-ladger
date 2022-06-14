import React from 'react';
import cn from 'classnames';

import styles from './styles.less';

interface IBoxProps extends React.ComponentPropsWithoutRef<'div'> {
	col?: boolean;

	alignstart?: boolean; // todo refactoring
	alignend?: boolean;

	start?: boolean;
	center?: boolean;
	end?: boolean;
	between?: boolean;
}

export class Box extends React.Component<IBoxProps> {
	render() {
		const { className, ...props } = this.props;

		const classNameComponent = cn(styles.component, className, {
			[styles.col]: props.col,

			// align
			[styles.alignstart]: props.alignstart,
			[styles.alignend]: props.alignend,

			// justify
			// [styles.start]: props.start,
			[styles.center]: props.center,
			[styles.end]: props.end,
			[styles.between]: props.between,
		});

		return (
			<div className={classNameComponent} {...props}>
				{this.props.children}
			</div>
		);
	}
}

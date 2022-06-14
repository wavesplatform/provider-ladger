import React from 'react';
import cn from 'classnames'

import styles from './styles.less';

interface IText extends React.ComponentPropsWithoutRef<'span'> {
	/* size */
	xl?: boolean;
	l?: boolean;
	m?: boolean;
	s?: boolean;

	/* color */
	second?: boolean;
	label?: boolean;
	descr?: boolean;
	inactive?: boolean;
}

interface IText extends React.ComponentPropsWithoutRef<'span'> {}

export class Text extends React.Component<IText> {

	render() {
		const { className, children, ...props } = this.props;
		const componentClassName = cn(styles.component, className, {
			...this.size(),
			...this.color(),
		});

		return (
			<span
				className={componentClassName}
				{...props}
			>{children}</span>
		);
	}

	size() {
		const props = this.props;

		return {
			[styles.xlarge]: props.xl,
			[styles.large]: props.l,
			[styles.medium]: props.m,
			[styles.small]: props.s,
		};
	}

	color() {
		const props = this.props;

		return {
			[styles.second]: props.second,
			[styles.label]: props.label,
			[styles.descr]: props.descr,
			[styles.inactive]: props.inactive,
		};
	}
}

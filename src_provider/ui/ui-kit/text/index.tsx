import React from 'react';
import cn from 'classnames'

import styles from './styles.less';

interface ITitle extends React.ComponentPropsWithoutRef<'span'> {}
interface ISubTitle extends React.ComponentPropsWithoutRef<'span'> {}

export class Title extends React.Component<ITitle> {

    render() {
        const { className, children, ...props } = this.props;

        return (
            <span
                className={cn(styles.title, className)}
                {...props}
            >{children}</span>
        );
    }
}

export class SubTitle extends React.Component<ISubTitle> {

    render() {
        const { className, children, ...props } = this.props;

        return (
            <span
                className={cn(styles.subtitle, className)}
                {...props}
            >{children}</span>
        );
    }
}

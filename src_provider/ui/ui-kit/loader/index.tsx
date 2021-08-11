import React from 'react';
import cn from 'classnames';

import styles from './styles.less';

interface ILoaderProps extends React.ComponentPropsWithoutRef<'div'> {}

export class Loader extends React.Component<ILoaderProps> {
    render() {
        const { className } = this.props;

        return (

            <div className={cn(styles.component, className)}>
                <div className={cn(styles.spinner)}>
                    <div className={cn(styles.circle, styles.bounce1)}></div>
                    <div className={cn(styles.circle, styles.bounce2)}></div>
                    <div className={cn(styles.circle)}></div>
                </div>
            </div>
        );
    }
}

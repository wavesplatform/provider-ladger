import React from 'react';
import cn from 'classnames';

import styles from './styles.less';

interface IBoxProps extends React.ComponentPropsWithoutRef<'div'> {
    start?: boolean;
    col?: boolean;
}

export class Box extends React.Component<IBoxProps> {
    render() {
        const { className, ...props } = this.props;

        const classNameComponent = cn(styles.component, className, {
            [styles.col]: props.col,
            [styles.start]: props.start, // align
        });

        return (
            <div className={classNameComponent} {...props}>
                {this.props.children}
            </div>
        );
    }
}

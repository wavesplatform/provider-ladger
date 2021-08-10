import React from 'react';
import cn from 'classnames';

import styles from './styles.less';

interface IBoxProps extends React.ComponentPropsWithoutRef<'button'> {
    col?: boolean;
}

export class Box extends React.Component<IBoxProps> {
    render() {
        const { className, ...props } = this.props;

        const classNameComponent = cn(styles.component, className, {
            [styles.col]: props.col
        });

        return (
            <div className={classNameComponent}>{this.props.children}</div>
        );
    }
}

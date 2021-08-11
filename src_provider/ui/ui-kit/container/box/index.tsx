import React from 'react';
import cn from 'classnames';

import styles from './styles.less';

interface IBoxProps extends React.ComponentPropsWithoutRef<'div'> {
    col?: boolean;

    start?: boolean; // todo refactoring
    alignend?: boolean;

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
            [styles.start]: props.start,
            [styles.alignend]: props.alignend,

            // justify
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

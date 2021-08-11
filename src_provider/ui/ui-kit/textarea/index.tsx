import React from 'react';
import cn from 'classnames'

import styles from './styles.less';

interface ITextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {}

export class Textarea extends React.Component<ITextareaProps> {

    render() {
        const { className, children, ...props } = this.props;

        return (
            <textarea
                className={cn(styles.component, className)}
                {...props}
            >{children}</textarea>
        );
    }
}

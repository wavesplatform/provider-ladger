import React from 'react';
import cn from 'classnames'

import styles from './styles.less';

interface IButtonIconProps extends React.ComponentPropsWithoutRef<'button'> {}

/* TODO make fabric */
export class ButtonIconClose extends React.Component<IButtonIconProps> {

    render() {
        const { className, children, ...props } = this.props;

        return (
            <button
                className={cn(styles.buttonicon, className)}
                {...props}
            >
                <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1.70711" y1="1.29289" x2="24.7071" y2="24.2929" stroke="#6C7486" stroke-width="2"/>
                    <line x1="1.29289" y1="24.2929" x2="24.2929" y2="1.29289" stroke="#6C7486" stroke-width="2"/>
                </svg> 
            </button>
        );
    }
}

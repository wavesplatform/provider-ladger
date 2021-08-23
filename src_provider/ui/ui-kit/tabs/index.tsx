import React from 'react';
import cn from 'classnames'

import { Box, Text } from '..';
import styles from './styles.less';

interface ITabProps extends React.ComponentPropsWithoutRef<'div'> {
    items: any[]
    value: any;
    onChange?: (vaue: any) => void;
}

export class Tabs extends React.Component<ITabProps> {

    render() {
        const { className, items } = this.props;

        return (
            <Box className={cn(styles.component, className)}>
                {items.map(this.renderTab, this)}
            </Box>
        );
    }

    renderTab(tab: any) {
        const isActive = (tab == this.props.value);
        const className = cn(styles.tab, {
            [styles.active]: isActive
        });

        return (
            <Box className={className} onClick={() => this.onClick(tab)}>
                <Text inactive={!isActive}>{tab}</Text>
                {isActive ? <div className={styles.line}></div> : null}
            </Box>
        )
    }

    onClick(value) {
        if (value !== this.props.value) {
            this.props.onChange && this.props.onChange(value);
        }
    }
}

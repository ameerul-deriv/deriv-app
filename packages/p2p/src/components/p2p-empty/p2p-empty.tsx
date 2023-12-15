import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';

type TP2pEmptyProps = {
    className?: string;
    children: React.ReactNode;
    has_tabs?: boolean;
    icon: string;
    is_disabled?: boolean;
    max_width?: string;
    title: string;
    weight?: string;
};

const P2pEmpty = ({
    className,
    children,
    has_tabs = false,
    icon,
    is_disabled = false,
    max_width = '628px',
    title,
    weight = 'bold',
}: TP2pEmptyProps) => {
    const is_disabled_color = is_disabled ? 'disabled' : '';
    return (
        <div
            className={classNames(className, 'p2p-empty', { 'p2p-empty--no-tabs': !has_tabs })}
            style={{ maxWidth: max_width }}
        >
            <Icon className='p2p-empty-icon' color={is_disabled_color} icon={icon} size={128} />
            <div className='p2p-empty-title'>
                <Text color={is_disabled_color} weight={weight}>
                    {title}
                </Text>
            </div>
            {children}
        </div>
    );
};

export default P2pEmpty;

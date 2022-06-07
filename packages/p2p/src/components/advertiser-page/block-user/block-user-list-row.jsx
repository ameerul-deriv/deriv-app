import React from 'react';
import { Button, Table, Text } from '@deriv/components';
import UserAvatar from 'Components/user/user-avatar';
import { localize } from 'Components/i18next';
import './block-user-list-row.scss';
import { isMobile } from '@deriv/shared';

const BlockUserListRow = () => {
    if (isMobile()) {
        <div className='block-user-list-row'>
            <div>
                <div className='block-user-list-row__cell'>
                    <UserAvatar nickname={'name'} size={32} text_size='s' />
                    <div className='block-user-list-row__cell--container'>
                        <Text size='xs' line_height='m' color='general'>
                            test name
                        </Text>
                    </div>
                </div>
            </div>
            <div className='block-user-list-row__button'>
                <Button secondary large>
                    {localize('Unblock')}
                </Button>
            </div>
        </div>;
    }

    return (
        <Table.Row className='block-user-list-row'>
            <Table.Cell>
                <div className='block-user-list-row__cell'>
                    <UserAvatar nickname={'name'} size={32} text_size='s' />
                    <div className='block-user-list-row__cell--container'>
                        <Text size='xs' line_height='m' color='general'>
                            test name
                        </Text>
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell className='block-user-list-row__button'>
                <Button secondary large>
                    {localize('Unblock')}
                </Button>
            </Table.Cell>
        </Table.Row>
    );
};

export default BlockUserListRow;

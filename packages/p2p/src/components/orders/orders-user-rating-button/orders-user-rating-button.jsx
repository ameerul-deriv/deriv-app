import React from 'react';
import { Button, Icon } from '@deriv/components';
import { Localize } from 'Components/i18next';

const OrdersUserRatingButton = ({ has_full_text, is_disabled }) => {
    return (
        <Button is_disabled={is_disabled} secondary small className='orders-user-rating-button'>
            <Icon icon='IcFullStar' className='orders-user-rating-button-icon' color={is_disabled && 'disabled'} />
            {has_full_text ? (
                <Localize i18n_default_text='Rate this transaction' />
            ) : (
                <Localize i18n_default_text='Rate' />
            )}
        </Button>
    );
};

export default OrdersUserRatingButton;

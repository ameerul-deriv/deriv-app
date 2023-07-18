import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { getTextSize } from 'Utils/responsive';
import './rate-change-modal.scss';

const RateChangeModal = ({ currency }) => {
    const {
        client: { local_currency_config },
    } = useStore();

    const { floating_rate_store } = useStores();
    const local_currency = currency ?? local_currency_config?.currency;
    const { hideModal, is_modal_open } = useModalManagerContext();

    const closeModal = () => {
        floating_rate_store.setIsMarketRateChanged(false);
        hideModal();
    };

    return (
        <Modal
            is_open={is_modal_open && floating_rate_store.is_market_rate_changed}
            toggleModal={closeModal}
            small
            className='rate-change-modal'
        >
            <Modal.Body>
                <Text
                    as='p'
                    align='left'
                    className='rate-change-modal__message'
                    size={getTextSize('xxs', 'xs')}
                    line_height='s'
                >
                    <Localize
                        i18n_default_text={'The {{local_currency}} market rate has changed.'}
                        values={{ local_currency }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer className='rate-change-modal__button'>
                <Button onClick={closeModal} text={localize('Try again')} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(RateChangeModal);

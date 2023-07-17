import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const ConfirmDeletePaymentMethodModal = () => {
    const { my_profile_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={
                <Text color='prominent' weight='bold'>
                    <Localize
                        i18n_default_text='Delete {{payment_method_name}}?'
                        values={{
                            payment_method_name:
                                my_profile_store?.payment_method_to_delete?.fields?.bank_name?.value ||
                                my_profile_store?.payment_method_to_delete?.fields?.name?.value ||
                                my_profile_store?.payment_method_to_delete?.display_name,
                        }}
                    />
                </Text>
            }
        >
            <Modal.Body className='confirm-delete-payment-method-modal'>
                <Text as='p' size='xs' color='prominent'>
                    <Localize i18n_default_text='Are you sure you want to remove this payment method?' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Yes, remove')}
                    onClick={my_profile_store.onClickDelete}
                    secondary
                    large
                />
                <Button has_effect text={localize('No')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDeletePaymentMethodModal;

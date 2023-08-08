/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { reaction } from 'mobx';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper, Modal, ThemedScrollbars } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethodForm from 'Pages/my-profile/payment-methods/add-payment-method/add-payment-method-form.jsx';
import BuySellForm from 'Pages/buy-sell/buy-sell-form.jsx';
import BuySellFormReceiveAmount from 'Pages/buy-sell/buy-sell-form-receive-amount.jsx';
import { api_error_codes } from 'Constants/api-error-codes';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import BuySellModalFooter from './buy-sell-modal-footer';
import BuySellModalTitle from './buy-sell-modal-title';
import BuySellModalError from './buy-sell-modal-error';

const BuySellModal = () => {
    const MAX_ALLOWED_RATE_CHANGED_WARNING_DELAY = 2000;
    const { hideModal, is_modal_open, showModal } = useModalManagerContext();
    const { buy_sell_store, floating_rate_store, general_store, my_profile_store, order_store } = useStores();
    const { form_error_code, selected_ad_state, table_type } = buy_sell_store;
    const { balance } = general_store;
    const { should_show_add_payment_method_form } = my_profile_store;

    const [error_message, setErrorMessage] = React.useState('');
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(true);
    const [is_account_balance_low, setIsAccountBalanceLow] = React.useState(false);
    const [has_rate_changed_recently, setHasRateChangedRecently] = React.useState(false);
    const history = useHistory();
    const location = useLocation();
    const submitForm = React.useRef(() => {
        // do nothing
    });

    const is_buy_table = table_type === buy_sell.BUY;
    const is_rate_change_error = form_error_code === api_error_codes.ORDER_CREATE_FAIL_RATE_CHANGED;
    const has_rate_changed = (!!error_message && is_rate_change_error) || has_rate_changed_recently;
    const show_low_balance_message = !is_buy_table && is_account_balance_low;

    const onCancel = () => {
        if (should_show_add_payment_method_form) {
            if (general_store.is_form_modified) {
                showModal({
                    key: 'CancelAddPaymentMethodModal',
                    // @ts-ignore TODO: fix typings in CancelAddPaymentMethodModal and make them optional and remove this comment
                    props: {},
                });
            } else {
                my_profile_store.hideAddPaymentMethodForm();
            }
        } else {
            hideModal();
            buy_sell_store.fetchAdvertiserAdverts();
        }
        floating_rate_store.setIsMarketRateChanged(false);
    };

    const onConfirmClick = (order_info: { id: string }) => {
        const current_query_params = new URLSearchParams(location.search);
        current_query_params.append('order', order_info.id);
        general_store.redirectTo('orders', { nav: { location: 'buy_sell' } });
        history.replace({
            pathname: routes.p2p_orders,
            search: current_query_params.toString(),
            hash: location.hash,
        });
        order_store.setOrderId(order_info.id);
        hideModal();
        buy_sell_store.fetchAdvertiserAdverts();
        buy_sell_store.setShowAdvertiserPage(false);
    };

    const setSubmitForm = (submitFormFn: () => void) => (submitForm.current = submitFormFn);

    const onSubmit = has_rate_changed
        ? showModal({
              key: 'MarketRateChangeErrorModal',
              // @ts-ignore TODO: fix typings in MarketRateChangeErrorModal and make them optional and remove this comment
              props: {},
          })
        : submitForm.current;

    React.useEffect(() => {
        const disposeHasRateChangedReaction = reaction(
            () => buy_sell_store.advert,
            (new_advert, previous_advert) => {
                // check to see if the rate is initialized in the store for the first time (when unitialized it is undefined) AND
                const rate_has_changed = previous_advert?.rate && previous_advert.rate !== new_advert.rate;
                // check to see if user is not switching between different adverts, it should not trigger rate change modal
                const is_the_same_advert = previous_advert?.id === new_advert.id;
                if (rate_has_changed && is_the_same_advert) {
                    setHasRateChangedRecently(true);
                    setTimeout(() => {
                        setHasRateChangedRecently(false);
                    }, MAX_ALLOWED_RATE_CHANGED_WARNING_DELAY);
                }
            }
        );

        const disposeFormErrorCodeReaction = reaction(
            () => form_error_code,
            () => {
                if (is_rate_change_error) {
                    showModal({
                        key: 'MarketRateChangeErrorModal',
                        // @ts-ignore TODO: fix typings in MarketRateChangeErrorModal and make them optional and remove this comment
                        props: {},
                    });
                    buy_sell_store.setFormErrorCode('');
                    setErrorMessage('');
                }
            }
        );

        return () => {
            disposeHasRateChangedReaction();
            disposeFormErrorCodeReaction();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const balance_check =
            parseFloat(balance) === 0 || parseFloat(balance) < buy_sell_store.advert?.min_order_amount_limit;

        setIsAccountBalanceLow(balance_check);
        if (!is_modal_open) {
            setErrorMessage('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_modal_open]);

    return (
        <React.Fragment>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='buy-sell-modal__body'
                    className='buy-sell-modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={is_modal_open}
                    onClickClose={() => {
                        // do nothing
                    }}
                    page_header_className='buy-sell-modal__header'
                    page_header_text={<BuySellModalTitle />}
                    pageHeaderReturnFn={onCancel}
                >
                    <BuySellModalError
                        error_message={error_message}
                        show_low_balance_message={show_low_balance_message}
                    />
                    {should_show_add_payment_method_form ? (
                        <AddPaymentMethodForm should_show_separated_footer />
                    ) : (
                        <React.Fragment>
                            <BuySellForm
                                advert={selected_ad_state}
                                handleClose={onCancel}
                                handleConfirm={onConfirmClick}
                                setIsSubmitDisabled={setIsSubmitDisabled}
                                setErrorMessage={setErrorMessage}
                                setSubmitForm={setSubmitForm}
                            />
                            <BuySellFormReceiveAmount />
                            <BuySellModalFooter
                                is_submit_disabled={!!is_submit_disabled}
                                onCancel={onCancel}
                                onSubmit={submitForm.current}
                            />
                        </React.Fragment>
                    )}
                </MobileFullPageModal>
            </MobileWrapper>
            <DesktopWrapper>
                <Modal
                    className={classNames('buy-sell-modal', {
                        'buy-sell-modal__form': should_show_add_payment_method_form,
                    })}
                    height={is_buy_table ? 'auto' : '649px'}
                    is_open={is_modal_open}
                    portalId='modal_root'
                    title={<BuySellModalTitle />}
                    toggleModal={onCancel}
                    width='456px'
                >
                    {/* Parent height - Modal.Header height - Modal.Footer height */}
                    <ThemedScrollbars height={is_buy_table ? '100%' : 'calc(100% - 5.8rem - 7.4rem)'}>
                        <Modal.Body className='buy-sell-modal__layout'>
                            <BuySellModalError
                                error_message={error_message}
                                show_low_balance_message={show_low_balance_message}
                            />
                            {should_show_add_payment_method_form ? (
                                <AddPaymentMethodForm should_show_separated_footer />
                            ) : (
                                <BuySellForm
                                    advert={selected_ad_state}
                                    handleClose={onCancel}
                                    handleConfirm={onConfirmClick}
                                    setIsSubmitDisabled={setIsSubmitDisabled}
                                    setErrorMessage={setErrorMessage}
                                    setSubmitForm={setSubmitForm}
                                />
                            )}
                        </Modal.Body>
                    </ThemedScrollbars>
                    {!should_show_add_payment_method_form && (
                        <Modal.Footer has_separator>
                            <BuySellModalFooter
                                is_submit_disabled={!!is_submit_disabled}
                                onCancel={onCancel}
                                onSubmit={onSubmit}
                            />
                        </Modal.Footer>
                    )}
                </Modal>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default observer(BuySellModal);

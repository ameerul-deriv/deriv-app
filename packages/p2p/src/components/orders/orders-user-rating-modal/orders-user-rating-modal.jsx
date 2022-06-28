import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import PropTypes from 'prop-types';
import StarRating from 'Components/star-rating';
import { useStores } from 'Stores';

const OrdersUserRatingModal = ({ is_orders_user_rating_modal_open }) => {
    const { order_store } = useStores();
    const [show_recommend, setShowRecommend] = React.useState(false);

    return (
        <Modal
            has_close_icon={false}
            is_open={is_orders_user_rating_modal_open}
            small
            title={localize('How would you rate this transaction?')}
        >
            <Modal.Body>
                <div className='orders__rating-modal-body'>
                    <StarRating
                        empty_star_className='orders__rating-star'
                        empty_star_icon='IcEmptyStar'
                        full_star_className='orders__rating-star'
                        full_star_icon='IcFullStar'
                        initial_value={0}
                        number_of_stars={5}
                        onClick={() => setShowRecommend(true)}
                        should_allow_hover_effect
                        star_size={25}
                    />
                    {show_recommend && (
                        <React.Fragment>
                            <Text color='prominent' size='xs'>
                                <Localize i18n_default_text='Would you recommend this seller?' />
                            </Text>
                            <div className='orders__rating--button-group'>
                                <Button icon='IcThumbsUp' secondary small text='Yes' />
                                <Button icon='IcThumbsDown' secondary small text='No' />
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                {show_recommend ? (
                    <Button
                        onClick={() => order_store.setIsOrdersUserRatingModalOpen(false)}
                        secondary
                        large
                        text='Skip'
                    />
                ) : (
                    <Button
                        onClick={() => order_store.setIsOrdersUserRatingModalOpen(false)}
                        primary
                        large
                        text='Done'
                    />
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default observer(OrdersUserRatingModal);

OrdersUserRatingModal.propTypes = {
    is_orders_user_rating_modal_open: PropTypes.bool,
};

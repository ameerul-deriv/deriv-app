import React from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import ShareMyAdsIcons from '../share-my-ads-icons';

type TShareMyAdsPopupProps = {
    onClose: () => void;
};

const ShareMyAdsPopup = ({ onClose }: TShareMyAdsPopupProps) => {
    const [is_closing, setIsClosing] = React.useState(false);
    const popup = document.getElementById('modal_root');

    const closePopup = () => {
        setIsClosing(true);
        setTimeout(() => onClose(), 500);
    };

    if (popup) {
        return createPortal(
            <div className='share-my-ads-popup'>
                <div
                    className={classNames('share-my-ads-popup__container', {
                        closing: is_closing,
                    })}
                >
                    <div className='share-my-ads-popup__container-header'>
                        <Text>
                            <Localize i18n_default_text='Share my ads' />
                        </Text>
                        <Icon className='share-my-ads-popup__container-icon' icon='IcCross' onClick={closePopup} />
                    </div>
                    <ShareMyAdsIcons />
                </div>
            </div>,
            popup
        );
    }

    return null;
};

export default ShareMyAdsPopup;

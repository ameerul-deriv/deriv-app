import React from 'react';
import { observer } from 'mobx-react-lite';
import domtoimage from 'dom-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { WhatsappShareButton, WhatsappIcon } from 'react-share';
import { Button, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const ShareAdModal = ({ advert }) => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { id, min_order_amount_limit_display, max_order_amount_limit_display, account_currency, type, rate_display } =
        advert;

    const divRef = React.useRef(null);
    const handleGenerateImage = () => {
        if (divRef.current) {
            const options = {};
            domtoimage
                .toPng(divRef.current, options)
                .then(dataUrl => {
                    const link = document.createElement('a');
                    link.download = 'test.png';
                    link.href = dataUrl;
                    link.click();
                })
                .catch(error => {
                    throw new Error(error);
                });
        }
    };

    return (
        <Modal has_close_icon is_open={is_modal_open} title='Share this ad' toggleModal={hideModal}>
            <Modal.Body>
                <div className='share-ad-modal'>
                    <div className='share-ad-modal__card' ref={divRef}>
                        <Text className='share-ad-modal__card-title' color='colored-background' weight='bold' size='m'>
                            <Localize i18n_default_text='deriv P2P' />
                        </Text>
                        <Text className='share-ad-modal__card-title' weight='bold' size='m'>
                            <Localize
                                i18n_default_text='{{type}} {{account_currency}}'
                                values={{ type, account_currency }}
                            />
                        </Text>
                        <Text color='colored-background'>
                            <Localize i18n_default_text='ID number {{id}}' values={{ id }} />
                        </Text>
                        <Text color='colored-background'>
                            <Localize
                                i18n_default_text='Limit {{min_order_amount_limit_display}} - {{max_order_amount_limit_display}} {{account_currency}}'
                                values={{
                                    min_order_amount_limit_display,
                                    max_order_amount_limit_display,
                                    account_currency,
                                }}
                            />
                        </Text>
                        <Text color='colored-background'>
                            <Localize i18n_default_text='Rate {{rate_display}}' values={{ rate_display }} />
                        </Text>
                        <div className='share-ad-modal__card--image'>
                            <QRCodeSVG
                                value={window.location.href}
                                size={128}
                                bgColor={'#ffffff'}
                                fgColor={'#000000'}
                                level={'L'}
                                includeMargin={false}
                                imageSettings={{
                                    src: 'https://play-lh.googleusercontent.com/ah8RkaAnph2gouJ48fVeybeJgw-tu2dzTDYL7miccIWxvd0ZcK5-MM20bGxjpjb2lXU',
                                    x: undefined,
                                    y: undefined,
                                    height: 26,
                                    width: 26,
                                    excavate: true,
                                }}
                            />
                        </div>
                    </div>
                    <Button primary onClick={handleGenerateImage}>
                        <Localize i18n_default_text='Share advert' />
                    </Button>
                    <div>
                        <WhatsappShareButton url={window.location.href}>
                            <WhatsappIcon size={32} round={true} />
                        </WhatsappShareButton>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default observer(ShareAdModal);

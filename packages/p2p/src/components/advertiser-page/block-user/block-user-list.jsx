import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const BlockUserList = () => {
    const { my_profile_store } = useStores();
    // TODO: Change icon from empty payment methods to no blocked advertisers icon
    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='payment-methods-empty'>
                    <Text className='payment-methods-empty--text' line_height='m' size='s' weight='bold'>
                        <Localize i18n_default_text='You have no blocked advertisers' />
                    </Text>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='payment-methods-empty'
                    height_offset='80px'
                    is_modal_open={true}
                    page_header_text={localize('Blocked advertisers')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    <Text className='payment-methods-empty--text' line_height='m' size='s' weight='bold'>
                        <Localize i18n_default_text='You have no blocked advertisers' />
                    </Text>
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default BlockUserList;

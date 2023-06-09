import React from 'react';
import { AutoSizer, DesktopWrapper, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import DailyLimitModal from 'Components/daily-limit-modal';
import MyProfileContent from './my-profile-content.jsx';
import MyProfileHeader from './my-profile-header';
import MyProfileDetailsContainer from './my-profile-stats/my-profile-details-container';

const MyProfile = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getSettings();

        return () => {
            // leave this in the return otherwise the default isn't set to my stats
            my_profile_store.setActiveTab(my_profile_tabs.MY_STATS);
            my_profile_store.setShouldShowAddPaymentMethodForm(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.error_message) {
        return (
            <div className='my-profile__error'>
                <Text align='center' as='p' className='dp2p-table-error' color='loss-danger' size='xs'>
                    {my_profile_store.error_message}
                </Text>
            </div>
        );
    }

    return (
        <AutoSizer>
            {({ height, width }) => (
                <div className='my-profile' style={{ height, width }}>
                    <div className='my-profile__content'>
                        <DailyLimitModal />
                        <MyProfileDetailsContainer />
                        <DesktopWrapper>
                            <MyProfileHeader />
                        </DesktopWrapper>
                        <MyProfileContent />
                    </div>
                </div>
            )}
        </AutoSizer>
    );
};

export default observer(MyProfile);

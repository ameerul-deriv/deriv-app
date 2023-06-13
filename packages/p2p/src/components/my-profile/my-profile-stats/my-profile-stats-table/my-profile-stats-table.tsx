import React from 'react';
import { Money, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';

const MyProfileStatsTable = () => {
    const {
        client: { currency },
    } = useStore();

    const { general_store } = useStores();

    const {
        buy_completion_rate,
        buy_orders_amount,
        buy_orders_count,
        buy_time_avg,
        partner_count,
        release_time_avg,
        sell_completion_rate,
        sell_orders_amount,
        sell_orders_count,
        total_orders_count,
        total_turnover,
    } = general_store.advertiser_info;

    const [show_lifetime_turnover_value, setShowLifetimeTurnoverValue] = React.useState(false);
    const [show_lifetime_order_value, setShowLifetimeOrderValue] = React.useState(false);

    const avg_buy_time_in_minutes = buy_time_avg > 60 ? Math.round(buy_time_avg / 60) : '< 1';
    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '< 1';

    return (
        <div className='my-profile-stats-table'>
            <div className='my-profile-stats-table__cell'>
                <Text as='p' color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='Buy completion  <0>30d</0>'
                        components={[
                            <Text
                                key={0}
                                className='my-profile-stats-table--italic'
                                color='less-prominent'
                                size={isMobile() ? 'xxxs' : 'xs'}
                            />,
                        ]}
                    />
                </Text>
                <Text as='p' color='prominent' size='xs' weight='bold'>
                    {buy_completion_rate ? `${buy_completion_rate}% (${buy_orders_count})` : '-'}
                </Text>
            </div>
            <div className='my-profile-stats-table__cell'>
                <Text as='p' color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='Sell completion  <0>30d</0>'
                        components={[
                            <Text
                                key={0}
                                className='my-profile-stats-table--italic'
                                color='less-prominent'
                                size={isMobile() ? 'xxxs' : 'xs'}
                            />,
                        ]}
                    />
                </Text>
                <Text as='p' color='prominent' size='xs' weight='bold'>
                    {sell_completion_rate ? `${sell_completion_rate}% (${sell_orders_count})` : '-'}
                </Text>
            </div>
            <div className='my-profile-stats-table__cell'>
                <Text as='p' color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='Avg pay time  <0>30d</0>'
                        components={[
                            <Text
                                key={0}
                                className='my-profile-stats-table--italic'
                                color='less-prominent'
                                size={isMobile() ? 'xxxs' : 'xs'}
                            />,
                        ]}
                    />
                </Text>
                <Text as='p' color='prominent' size='xs' weight='bold'>
                    {buy_time_avg ? (
                        <Localize
                            i18n_default_text='{{- avg_buy_time_in_minutes}} min'
                            values={{ avg_buy_time_in_minutes }}
                        />
                    ) : (
                        '-'
                    )}
                </Text>
            </div>
            <div className='my-profile-stats-table__cell'>
                <Text as='p' color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='Avg release time  <0>30d</0>'
                        components={[
                            <Text
                                key={0}
                                className='my-profile-stats-table--italic'
                                color='less-prominent'
                                size={isMobile() ? 'xxxs' : 'xs'}
                            />,
                        ]}
                    />
                </Text>
                <Text as='p' color='prominent' size='xs' weight='bold'>
                    {release_time_avg ? (
                        <Localize
                            i18n_default_text='{{- avg_release_time_in_minutes}} min'
                            values={{ avg_release_time_in_minutes }}
                        />
                    ) : (
                        '-'
                    )}
                </Text>
            </div>
            <div className='my-profile-stats-table__cell'>
                <Text as='p' color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='Trade volume  <0>30d</0> | <1>lifetime</1>'
                        components={[
                            <Text
                                className='my-profile-stats-table--pointer'
                                color={show_lifetime_turnover_value ? 'loss-danger' : 'less-prominent'}
                                key={0}
                                onClick={() => setShowLifetimeTurnoverValue(!show_lifetime_turnover_value)}
                                size={isMobile() ? 'xxxs' : 'xs'}
                            />,
                            <Text
                                className='my-profile-stats-table--pointer'
                                color={show_lifetime_turnover_value ? 'less-prominent' : 'loss-danger'}
                                key={0}
                                onClick={() => setShowLifetimeTurnoverValue(!show_lifetime_turnover_value)}
                                size={isMobile() ? 'xxxs' : 'xs'}
                            />,
                        ]}
                    />
                </Text>
                <Text as='p' color='prominent' size='xs' weight='bold'>
                    {show_lifetime_turnover_value ? (
                        <Money amount={total_turnover} currency={currency} show_currency />
                    ) : (
                        <Money
                            amount={Number(buy_orders_amount) + Number(sell_orders_amount)}
                            currency={currency}
                            show_currency
                        />
                    )}
                </Text>
            </div>
            <div className='my-profile-stats-table__cell'>
                <Text as='p' color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='Total orders  <0>30d</0> | <1>lifetime</1>'
                        components={[
                            <Text
                                key={0}
                                className='my-profile-stats-table--pointer'
                                color={show_lifetime_order_value ? 'loss-danger' : 'less-prominent'}
                                onClick={() => setShowLifetimeOrderValue(!show_lifetime_order_value)}
                                size={isMobile() ? 'xxxs' : 'xs'}
                            />,
                            <Text
                                key={0}
                                className='my-profile-stats-table--pointer'
                                color={show_lifetime_order_value ? 'less-prominent' : 'loss-danger'}
                                onClick={() => setShowLifetimeOrderValue(!show_lifetime_order_value)}
                                size={isMobile() ? 'xxxs' : 'xs'}
                            />,
                        ]}
                    />
                </Text>
                <Text as='p' color='prominent' size='xs' weight='bold'>
                    {show_lifetime_order_value
                        ? total_orders_count
                        : Number(buy_orders_count) + Number(sell_orders_count)}
                </Text>
            </div>
            <div className='my-profile-stats-table__cell'>
                <Text as='p' color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize i18n_default_text='Trade partners' />
                </Text>
                <Text as='p' color='prominent' size='xs' weight='bold'>
                    {partner_count || '0'}
                </Text>
            </div>
        </div>
    );
};

export default observer(MyProfileStatsTable);

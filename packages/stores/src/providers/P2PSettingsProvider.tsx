import React, { ReactNode } from 'react';
import { useSubscription } from '@deriv/api';
import P2PSettingsContext from '../stores/P2PSettingsContext';

type TP2PSettingsProvider = {
    children: ReactNode;
};

const P2PSettingsProvider = ({ children }: TP2PSettingsProvider) => {
    const { data, subscribe, ...rest } = useSubscription('p2p_settings');

    const p2p_settings = React.useMemo(() => {
        const p2p_settings_data = data?.p2p_settings;

        if (!p2p_settings_data) return undefined;

        const reached_target_date = () => {
            if (!p2p_settings_data?.fixed_rate_adverts_end_date) return false;

            const current_date = new Date(new Date().getTime()).setUTCHours(23, 59, 59, 999);
            const cutoff_date = new Date(
                new Date(p2p_settings_data?.fixed_rate_adverts_end_date).getTime()
            ).setUTCHours(23, 59, 59, 999);

            return current_date > cutoff_date;
        };

        const currency_list = p2p_settings_data?.local_currencies.map(currency => {
            const { display_name, has_adverts, is_default, symbol } = currency;

            return {
                component: (
                    <div className='currency-dropdown__list-item'>
                        <div className='currency-dropdown__list-item-symbol'>{symbol}</div>
                        <div className='currency-dropdown__list-item-name'>{display_name}</div>
                    </div>
                ),
                display_name,
                has_adverts,
                is_default,
                text: symbol,
                value: symbol,
            };
        });

        return {
            ...p2p_settings_data,
            /** Indicates if the cross border ads feature is enabled. */
            is_cross_border_ads_enabled: Boolean(p2p_settings_data?.cross_border_ads_enabled),
            /** Indicates if the P2P service is unavailable. */
            is_disabled: Boolean(p2p_settings_data?.disabled),
            /** Indicates if the payment methods feature is enabled. */
            is_payment_methods_enabled: Boolean(p2p_settings_data?.payment_methods_enabled),
            /** Indicates if the current rate type is floating or fixed rates */
            rate_type: (p2p_settings_data?.float_rate_adverts === 'enabled' ? 'float' : 'fixed') as 'float' | 'fixed',
            /** Indicates the maximum rate offset for floating rate adverts. */
            float_rate_offset_limit_string:
                p2p_settings_data?.float_rate_offset_limit.toString().split('.')?.[1]?.length > 2
                    ? (p2p_settings_data?.float_rate_offset_limit - 0.005).toFixed(2)
                    : (p2p_settings_data?.float_rate_offset_limit).toFixed(2),
            reached_target_date: reached_target_date(),
            local_currencies: currency_list,
        };
    }, [data]);

    return (
        <P2PSettingsContext.Provider value={{ p2p_settings, subscribe, rest }}>{children}</P2PSettingsContext.Provider>
    );
};

export default P2PSettingsProvider;

import React from 'react';
import { observer } from 'mobx-react-lite';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import TourGuide from 'Modules/tour-guide/tour-guide';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import { useStores } from 'Stores/index';
import { isDesktop, routes, ContentFlag, isMobile } from '@deriv/shared';
import { DesktopWrapper, MobileWrapper, ButtonToggle, Div100vhContainer, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';

import './traders-hub.scss';

const TradersHub = () => {
    const { traders_hub, client, ui } = useStores();
    const {
        notification_messages_ui: Notifications,
        openRealAccountSignup,
        is_from_signup_account,
        setIsFromSignupAccount,
    } = ui;
    const {
        is_landing_company_loaded,
        is_logged_in,
        is_switching,
        is_logging_in,
        is_account_setting_loaded,
        has_active_real_account,
    } = client;
    const { selected_platform_type, setTogglePlatformType, is_tour_open, content_flag, is_eu_user } = traders_hub;
    const traders_hub_ref = React.useRef<HTMLDivElement>(null);

    const can_show_notify = !is_switching && !is_logging_in && is_account_setting_loaded && is_landing_company_loaded;

    const [scrolled, setScrolled] = React.useState(false);

    const handleScroll = () => {
        const element = traders_hub_ref?.current;
        if (element && is_tour_open) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    React.useEffect(() => {
        if (is_eu_user) setTogglePlatformType('cfd');
        if (
            !has_active_real_account &&
            is_logged_in &&
            is_from_signup_account &&
            content_flag === ContentFlag.EU_DEMO
        ) {
            openRealAccountSignup('maltainvest');
            setIsFromSignupAccount(false);
        }
    }, []);

    React.useEffect(() => {
        let setScrolledTimerId: NodeJS.Timeout;

        const handleScrollTimerId = setTimeout(() => {
            handleScroll();
            setScrolledTimerId = setTimeout(() => {
                setScrolled(true);
            }, 200);
        }, 100);

        // Clear the timers when the component unmounts or when the dependencies change
        return () => {
            clearTimeout(handleScrollTimerId);
            clearTimeout(setScrolledTimerId);
        };
    }, [is_tour_open]);

    const eu_title = content_flag === ContentFlag.EU_DEMO || content_flag === ContentFlag.EU_REAL || is_eu_user;

    const is_eu_low_risk = content_flag === ContentFlag.LOW_RISK_CR_EU;

    const platform_toggle_options = is_eu_user
        ? [
              { text: 'CFDs', value: 'cfd' },
              { text: `${eu_title ? 'Multipliers' : 'Options & Multipliers'}`, value: 'options' },
          ]
        : [
              { text: `${eu_title ? 'Multipliers' : 'Options & Multipliers'}`, value: 'options' },
              { text: 'CFDs', value: 'cfd' },
          ];

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setTogglePlatformType(event.target.value);
    };
    if (!is_logged_in) return null;

    const EUDisclamer = () => {
        return (
            <div className='disclamer'>
                <Text align='left' className='disclamer-text' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='<0>EU statutory disclaimer</0>: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>71% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
                        components={[<strong key={0} />]}
                    />
                </Text>
            </div>
        );
    };

    const contentForOptionandCfdListing = () => {
        if (is_eu_user) {
            return (
                <div className='traders-hub__main-container'>
                    <CFDsListing />
                    <OptionsAndMultipliersListing />
                </div>
            );
        }
        return (
            <div className='traders-hub__main-container'>
                <OptionsAndMultipliersListing />
                <CFDsListing />
            </div>
        );
    };

    return (
        <>
            <Div100vhContainer
                className={classNames('traders-hub--mobile', {
                    'traders-hub--mobile--eu-user': is_eu_user,
                })}
                height_offset='50px'
                is_disabled={isDesktop()}
            >
                {can_show_notify && <Notifications />}
                <div id='traders-hub' className='traders-hub' ref={traders_hub_ref}>
                    <MainTitleBar />
                    <DesktopWrapper>{contentForOptionandCfdListing()}</DesktopWrapper>
                    <MobileWrapper>
                        {is_landing_company_loaded ? (
                            <ButtonToggle
                                buttons_arr={platform_toggle_options}
                                className='traders-hub__button-toggle'
                                has_rounded_button
                                is_traders_hub={window.location.pathname === routes.traders_hub}
                                name='platforn_type'
                                onChange={platformTypeChange}
                                value={selected_platform_type}
                            />
                        ) : (
                            <ButtonToggleLoader />
                        )}
                        {selected_platform_type === 'cfd' && <CFDsListing />}
                        {selected_platform_type === 'options' && <OptionsAndMultipliersListing />}
                    </MobileWrapper>
                    <ModalManager />
                    {scrolled && <TourGuide />}
                </div>
            </Div100vhContainer>
            {is_eu_low_risk && <EUDisclamer />}
        </>
    );
};

export default observer(TradersHub);

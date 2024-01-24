import React from 'react';
import { APIProvider } from '@deriv/api';
import { CashierStore } from '@deriv/cashier';
import { CFDStore } from '@deriv/cfd';
import {
    POIProvider,
    initFormErrorMessages,
    setSharedCFDText,
    setUrlLanguage,
    setWebsocket,
    useOnLoadTranslation,
} from '@deriv/shared';
import { StoreProvider, ExchangeRatesProvider, P2PSettingsProvider } from '@deriv/stores';
import { getLanguage, initializeTranslations } from '@deriv/translations';
import WS from 'Services/ws-methods';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { CFD_TEXT } from '../Constants/cfd-text';
import { FORM_ERROR_MESSAGES } from '../Constants/form-error-messages';
import AppContent from './AppContent';
import 'Sass/app.scss';
import { Analytics } from '@deriv/analytics';
import initHotjar from '../Utils/Hotjar';
import { BreakpointProvider } from '@deriv/quill-design';

const AppWithoutTranslation = ({ root_store }) => {
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const [is_translation_loaded] = useOnLoadTranslation();
    const initCashierStore = () => {
        root_store.modules.attachModule('cashier', new CashierStore(root_store, WS));
        root_store.modules.cashier.general_store.init();
    };
    // TODO: investigate the order of cashier store initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(initCashierStore, []);
    const initCFDStore = () => {
        root_store.modules.attachModule('cfd', new CFDStore({ root_store, WS }));
    };

    React.useEffect(initCFDStore, []);

    React.useEffect(() => {
        const loadSmartchartsStyles = () => {
            import('@deriv/deriv-charts/dist/smartcharts.css');
        };

        initializeTranslations();
        if (process.env.RUDDERSTACK_KEY) {
            const config = {
                growthbookKey:
                    process.env.IS_GROWTHBOOK_ENABLED === 'true' ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                growthbookDecryptionKey:
                    process.env.IS_GROWTHBOOK_ENABLED === 'true' ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
            };

            Analytics.initialise(config);
        }

        // TODO: [translation-to-shared]: add translation implemnentation in shared
        setUrlLanguage(getLanguage());
        initFormErrorMessages(FORM_ERROR_MESSAGES);
        setSharedCFDText(CFD_TEXT);
        root_store.common.setPlatform();
        loadSmartchartsStyles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        initHotjar(root_store.client);
    }, []);

    const platform_passthrough = {
        root_store,
        WS,
    };

    setWebsocket(WS);

    React.useEffect(() => {
        if (!root_store.client.email) {
            Analytics.reset();
        }
    }, [root_store.client.email]);

    return (
        <>
            {is_translation_loaded ? (
                <Router basename={has_base ? `/${base}` : null}>
                    <StoreProvider store={root_store}>
                        <BreakpointProvider>
                            <APIProvider>
                                <POIProvider>
                                    <StoreProvider store={root_store}>
                                        <ExchangeRatesProvider>
                                            <P2PSettingsProvider>
                                                <AppContent passthrough={platform_passthrough} />
                                            </P2PSettingsProvider>
                                        </ExchangeRatesProvider>
                                    </StoreProvider>
                                </POIProvider>
                            </APIProvider>
                        </BreakpointProvider>
                    </StoreProvider>
                </Router>
            ) : (
                <></>
            )}
        </>
    );
};

AppWithoutTranslation.propTypes = {
    root_store: PropTypes.object,
};
const App = withTranslation()(AppWithoutTranslation);

export default App;

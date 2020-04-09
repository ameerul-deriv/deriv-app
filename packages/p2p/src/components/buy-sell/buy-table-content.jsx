import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { localize } from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import { RowComponent, BuySellRowLoader } from './row.jsx';

export class BuySellTableContent extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false;
    has_more_items_to_load = false;
    offset = 0;
    limit = 50;
    state = {
        api_error_message: '',
        is_loading: true,
        items: [],
    };

    componentDidMount() {
        this.is_mounted = true;
        this.loadMoreItems(this.offset, this.limit);
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    loadMoreItems(start_idx, stop_idx) {
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type: this.props.is_buy ? 'buy' : 'sell',
                limit: stop_idx,
                offset: start_idx,
            }).then(response => {
                if (this.is_mounted) {
                    if (!response.error) {
                        this.has_more_items_to_load = response.length >= this.limit;
                        this.offset += this.limit;

                        this.setState({
                            items: this.state.items.concat(response),
                            is_loading: false,
                        });
                    } else {
                        this.setState({
                            api_error_message: response.error.message,
                            offset: this.state.offset + this.state.limit,
                        });
                    }
                    resolve();
                }
            });
        });
    }

    render() {
        const { api_error_message, is_loading, items } = this.state;
        const { is_buy, setSelectedAd } = this.props;
        const Row = props => <RowComponent {...props} is_buy={is_buy} setSelectedAd={setSelectedAd} />;

        if (is_loading) {
            return <Loading is_fullscreen={false} />;
        }
        if (api_error_message) {
            return <TableError message={api_error_message} />;
        }

        return items.length ? (
            <InfiniteLoaderList
                // screen size - header size - footer size - page overlay header - page overlay content padding -
                // tabs height - padding+margin of tab content - toggle height - table header height
                initial_height={'calc(100vh - 48px - 36px - 41px - 2.4rem - 36px - 3.2rem - 40px - 52px)'}
                items={items}
                RenderComponent={Row}
                RowLoader={BuySellRowLoader}
                has_more_items_to_load={this.has_more_items_to_load}
                loadMore={this.loadMoreItems.bind(this)}
            />
        ) : (
            <div className='deriv-p2p__empty'>
                {localize("No ads yet. If someone posts an ad, you'll see it here.")}
            </div>
        );
    }
}

BuySellTableContent.propTypes = {
    setSelectedAd: PropTypes.func,
};

import React from 'react';
import { InfiniteDataList, Loading, Table } from '@deriv/components';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import BlockUserRow from './block-user-row.jsx';
import { Localize } from 'Components/i18next';
import './block-user.scss';

const BlockUserListTable = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.setBlockedAdvertisersList([]);
        my_profile_store.getBlockedAdvertisersList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <Table className='block-user__table'>
                <Table.Header>
                    <Table.Row className='block-user__table-header'>
                        <Table.Head>
                            <Localize i18n_default_text='Advertisers' />
                        </Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body className='block-user__table-body'>
                    <InfiniteDataList
                        data_list_className='block-user__data-list'
                        has_more_items_to_load={my_profile_store.has_more_items_to_load}
                        items={my_profile_store.rendered_blocked_advertisers_list}
                        keyMapperFn={item => item.id}
                        loadMoreRowsFn={my_profile_store.getBlockedAdvertisersList}
                        rowRenderer={props => <BlockUserRow {...props} />}
                    />
                </Table.Body>
            </Table>
        </React.Fragment>
    );
};

export default observer(BlockUserListTable);

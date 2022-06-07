import React from 'react';
import { InfiniteDataList, Table } from '@deriv/components';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import BlockUserListRow from './block-user-list-row.jsx';

const BlockUserListTable = () => {
    const { my_profile_store } = useStores();

    return (
        <>
            <Table className='block-user-list__table'>
                <Table.Body className='buy-sell__table-body'>
                    <InfiniteDataList
                        data_list_className='block-user__data-list'
                        has_more_items_to_load={my_profile_store.has_more_items_to_load}
                        items={['test', 'test2', 'test3', 'test4']}
                        keyMapperFn={item => item.id}
                        // loadMoreRowsFn={my_profile_store.loadMoreItems}
                        rowRenderer={props => <BlockUserListRow {...props} />}
                    />
                </Table.Body>
            </Table>
        </>
    );
};

export default observer(BlockUserListTable);

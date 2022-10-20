import React from 'react';
import './table-error.scss';
import { Text } from '@deriv/components';

type TTableErrorProps = {
    message: string;
};

const TableError = ({ message }: TTableErrorProps) => (
    <Text as='p' color='loss-danger' size='xs' className='dp2p-table-error'>
        {message}
    </Text>
);

export default TableError;

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { useExtendedOrderDetails } from '@/hooks';
import { p2p, useActiveAccount, useServerTime } from '@deriv/api-v2';
import { InlineMessage, Loader, Text, useDevice } from '@deriv-com/ui';
import { OrderDetailsCard } from '../../components/OrderDetailsCard';
import { OrderDetailsCardFooter } from '../../components/OrderDetailsCard/OrderDetailsCardFooter';
import { OrdersChatSection } from '../OrdersChatSection';
import { OrderDetailsProvider } from './OrderDetailsProvider';
import './OrderDetails.scss';

type TOrderDetailsProps = {
    orderId: string;
};

const OrderDetails = ({ orderId }: TOrderDetailsProps) => {
    const [isChatLoading, setIsChatLoading] = useState(false);

    const history = useHistory();
    const { data: orderInfo, isLoading } = p2p.order.useGet(orderId);
    const { data: activeAccount } = useActiveAccount();
    const { data: serverTime } = useServerTime();
    const { data: orderDetails } = useExtendedOrderDetails({
        loginId: activeAccount?.loginid,
        orderDetails: orderInfo,
        serverTime,
    });
    const { isBuyOrderForUser, shouldShowLostFundsBanner } = orderDetails;
    const { isMobile } = useDevice();
    const headerText = `${isBuyOrderForUser ? 'Buy' : 'Sell'} USD order`;
    const onReturn = () => history.goBack();
    const warningMessage = 'Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.';

    if (isLoading) return <Loader isFullScreen />;

    if (isMobile) {
        return (
            <OrderDetailsProvider orderDetails={orderDetails}>
                <FullPageMobileWrapper
                    className='p2p-v2-order-details'
                    onBack={onReturn}
                    renderFooter={() => <OrderDetailsCardFooter />}
                    renderHeader={() => (
                        <Text size='lg' weight='bold'>
                            {headerText}
                        </Text>
                    )}
                >
                    {shouldShowLostFundsBanner && (
                        <InlineMessage className='w-fit mx-[1.6rem] mt-[1.6rem]' iconPosition='top' variant='warning'>
                            <Text size='xs'>{warningMessage}</Text>
                        </InlineMessage>
                    )}
                    <OrderDetailsCard />
                </FullPageMobileWrapper>
            </OrderDetailsProvider>
        );
    }

    return (
        <div className='w-full'>
            <PageReturn onClick={onReturn} pageTitle={headerText} weight='bold' />
            <div className='p2p-v2-order-details'>
                {shouldShowLostFundsBanner && (
                    <InlineMessage className='w-fit mb-6' variant='warning'>
                        <Text size='2xs'>{warningMessage}</Text>
                    </InlineMessage>
                )}
                <div className='grid grid-cols-none lg:grid-cols-2 lg:gap-14'>
                    <OrderDetailsProvider orderDetails={orderDetails}>
                        <OrderDetailsCard />
                    </OrderDetailsProvider>
                    <OrdersChatSection
                        id={orderId}
                        isInactive={!!orderDetails?.isInactiveOrder}
                        otherUserDetails={orderDetails?.otherUserDetails}
                        setIsChatLoading={setIsChatLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

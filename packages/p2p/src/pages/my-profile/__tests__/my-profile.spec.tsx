import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores/index';
import MyProfile from '../my-profile';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        advertiser_info: {
            buy_completion_rate: 100,
            buy_orders_amount: 1,
            buy_orders_count: 1,
            buy_time_avg: 80,
            partner_count: 1,
        },
    },
    my_profile_store: {
        error_message: '',
        getSettings: jest.fn(),
        setActiveTab: jest.fn(),
        setShouldShowAddPaymentMethodForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('../my-profile-content', () => jest.fn(() => <div>MyProfileContent</div>));
jest.mock('../my-profile-stats/my-profile-details-container', () =>
    jest.fn(() => <div>MyProfileDetailsContainer</div>)
);
jest.mock('../my-profile-header', () => jest.fn(() => <div>MyProfileHeader</div>));

describe('<MyProfile />', () => {
    it('should render MyProfile component', () => {
        render(<MyProfile />);

        expect(screen.getByText('MyProfileContent')).toBeInTheDocument();
        expect(screen.getByText('MyProfileDetailsContainer')).toBeInTheDocument();
        expect(screen.getByText('MyProfileHeader')).toBeInTheDocument();
    });

    it('should show error message if error_message has value', () => {
        mock_store.my_profile_store.error_message = 'test error';

        render(<MyProfile />);

        expect(screen.getByText('test error')).toBeInTheDocument();
    });
});

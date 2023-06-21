import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BlockUserDropdown from '../block-user-dropdown';
import userEvent from '@testing-library/user-event';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_profile_store: {
        block_user_sort_list: [
            {
                text: localize('All'),
                value: 'all_users',
            },
            {
                text: localize('Blocked'),
                value: 'blocked_users',
            },
        ],
        handleChange: jest.fn(),
        selected_sort_value: 'all_users',
    },
};

const mock_modal_manager = {
    showModal: jest.fn(),
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => children),
    MobileWrapper: jest.fn(({ children }) => children),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<BlockUserDropdown />', () => {
    it('should render BlockUserDropdown with default sorting as all_users', () => {
        render(<BlockUserDropdown />);

        expect(screen.getByText('Sort by')).toBeInTheDocument();
        expect(screen.getByText('All')).toBeInTheDocument();
    });

    it('should call showModal when clicking on filter icon in mobile', () => {
        render(<BlockUserDropdown />);

        const filter_icon = screen.getByTestId('dt_block_user_filter_icon');

        userEvent.click(filter_icon);

        expect(mock_modal_manager.showModal).toBeCalledTimes(1);
        expect(mock_modal_manager.showModal).toBeCalledWith({ key: 'BlockUserFilterModal' });
    });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

jest.mock('antd', () => ({
    Pagination: ({ current, onChange }) => (
        <div data-testid="pagination">
            <span data-testid="current-page">{current}</span>
            <button onClick={() => onChange(current + 1)}>下一页</button>
        </div>
    )
}));

describe('Pagination', () => {
    test('renders with correct current page', () => {
        const { getByTestId } = render(
            <Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />
        );
        expect(getByTestId('current-page').textContent).toBe('2');
    });

    test('calls onPageChange when next page is clicked', () => {
        const onPageChange = jest.fn();
        const { getByText } = render(
            <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
        );

        fireEvent.click(getByText('下一页'));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    test('does not render when total pages is 1', () => {
        const { queryByTestId } = render(
            <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
        );
        expect(queryByTestId('pagination')).toBeNull();
    });
});    
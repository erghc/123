import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SearchBox from './SearchBox';

describe('SearchBox', () => {
    test('renders correctly', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <SearchBox onSearch={() => {}} onFilterToggle={() => {}} filterActive={false} />
        );
        const input = getByPlaceholderText('搜索文件...');
        expect(input).toBeInTheDocument();
    });

    test('calls onSearch when form is submitted', () => {
        const mockSearch = jest.fn();
        const { getByPlaceholderText, getByText } = render(
            <SearchBox onSearch={mockSearch} onFilterToggle={() => {}} filterActive={false} />
        );
        const input = getByPlaceholderText('搜索文件...');
        const form = input.closest('form');

        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.submit(form);

        expect(mockSearch).toHaveBeenCalledWith('test');
    });

    test('clears search when clear button is clicked', () => {
        const mockSearch = jest.fn();
        const { getByPlaceholderText, getByIcon } = render(
            <SearchBox onSearch={mockSearch} onFilterToggle={() => {}} filterActive={false} />
        );
        const input = getByPlaceholderText('搜索文件...');

        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(getByIcon('times'));

        expect(input.value).toBe('');
        expect(mockSearch).toHaveBeenCalledWith('');
    });

    test('applies focus styles when focused', () => {
        const { getByPlaceholderText } = render(
            <SearchBox onSearch={() => {}} onFilterToggle={() => {}} filterActive={false} />
        );
        const input = getByPlaceholderText('搜索文件...');

        fireEvent.focus(input);
        expect(input).toHaveClass('focus:border-primary');
        expect(input).toHaveClass('focus:ring-2');
        expect(input).toHaveClass('focus:ring-primary/20');

        fireEvent.blur(input);
        expect(input).not.toHaveClass('focus:border-primary');
    });

    test('calls onFilterToggle when filter button is clicked', () => {
        const mockFilterToggle = jest.fn();
        const { getByIcon } = render(
            <SearchBox onSearch={() => {}} onFilterToggle={mockFilterToggle} filterActive={false} />
        );

        fireEvent.click(getByIcon('filter'));
        expect(mockFilterToggle).toHaveBeenCalled();
    });

    test('applies active styles when filter is active', () => {
        const { getByIcon } = render(
            <SearchBox onSearch={() => {}} onFilterToggle={() => {}} filterActive={true} />
        );
        const filterButton = getByIcon('filter').closest('button');

        expect(filterButton).toHaveClass('border-primary');
        expect(filterButton).toHaveClass('bg-primary/5');
        expect(getByIcon('filter')).toHaveClass('text-primary');
    });
});    
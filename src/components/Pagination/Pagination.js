import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as AntdPagination } from 'antd';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <AntdPagination
            current={currentPage}
            total={totalPages * 10} // 假设每页10条数据
            pageSize={10}
            onChange={onPageChange}
            showSizeChanger={false}
            className="mt-4 flex justify-center"
        />
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
};

export default Pagination;    
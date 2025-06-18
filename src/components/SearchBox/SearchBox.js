import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchBox = ({ onSearch, onFilterToggle, filterActive }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const clearSearch = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="search-box-container">
            <form onSubmit={handleSearch} className="search-form">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="搜索文件..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={`w-full py-3 px-4 pr-10 pl-12 rounded-lg border ${
                            isFocused || searchTerm ? 'border-primary focus:border-primary focus:ring-2 focus:ring-primary/20' : 'border-gray-300'
                        } transition-all duration-300 focus:outline-none`}
                    />
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                </div>
            </form>
            <button
                type="button"
                onClick={onFilterToggle}
                className={`ml-2 p-3 rounded-lg border ${
                    filterActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                } transition-all duration-300 hover:bg-gray-50 focus:outline-none`}
            >
                <FontAwesomeIcon icon={faFilter} className={`${filterActive ? 'text-primary' : 'text-gray-600'}`} />
            </button>
        </div>
    );
};

export default SearchBox;    
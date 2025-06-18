import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Pagination } from '@mui/material';
import SearchBox from '../components/SearchBox/SearchBox';
import FileList from '../components/FileList/FileList';
import { searchFiles } from '../services/searchService';
import PageWrapper from '../components/Layout/PageWrapper';
import { formatDistanceToNow } from 'date-fns';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = searchParams.get('query') || '';
        setSearchTerm(query);
        searchFiles(query, currentPage);
    }, [searchParams, currentPage]);

    const searchFiles = async (query, page = 1) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await searchFiles(query, page);
            setSearchResults(response.data.files);
            setTotalResults(response.data.totalResults);
            setTotalPages(Math.ceil(response.data.totalResults / response.data.pageSize));
        } catch (error) {
            setError(error.message || '搜索失败');
            console.error('Error searching files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
        setCurrentPage(1);
        searchFiles(newSearchTerm, 1);
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <PageWrapper title="搜索结果" breadcrumbs={[{ label: '搜索' }]}>
            <Container maxWidth="xl" className="py-6">
                <Box mb={6}>
                    <SearchBox onSearch={handleSearch} searchTerm={searchTerm} />
                    <Typography variant="body1" color="text.secondary" mt={2}>
                        找到 {totalResults} 个结果，搜索用时 <span className="font-medium">0.5</span> 秒
                    </Typography>
                </Box>

                <FileList 
                    files={searchResults} 
                    isLoading={isLoading} 
                    error={error}
                    onFileClick={(file) => console.log('File clicked:', file)}
                    onDirectoryClick={(directory) => console.log('Directory clicked:', directory)}
                />

                {totalPages > 1 && (
                    <Box mt={8} display="flex" justifyContent="center">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                )}
            </Container>
        </PageWrapper>
    );
};

export default SearchResultsPage;    
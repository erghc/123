import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import SearchBox from '../components/SearchBox/SearchBox';
import { useSelector } from 'react-redux';
import { fetchPopularSearches } from '../services/searchService';
import FileList from '../components/FileList/FileList';
import PageWrapper from '../components/Layout/PageWrapper';

const HomePage = () => {
    const navigate = useNavigate();
    const [popularSearches, setPopularSearches] = useState([]);
    const [recentFiles, setRecentFiles] = useState([]);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const loadPopularSearches = async () => {
            try {
                const response = await fetchPopularSearches();
                setPopularSearches(response.data);
            } catch (error) {
                console.error('Error fetching popular searches:', error);
            }
        };

        loadPopularSearches();
    }, []);

    const handleSearch = (searchTerm) => {
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <PageWrapper title="主页">
            <Container maxWidth="lg" className="py-12">
                <Box textAlign="center" mb={8}>
                    <Typography variant="h3" component="h1" className="font-bold mb-4">
                        FTP搜索系统
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={6}>
                        快速搜索和访问您的FTP文件
                    </Typography>
                    <SearchBox onSearch={handleSearch} />
                </Box>

                {user && (
                    <Box mt={12}>
                        <Typography variant="h5" component="h2" className="font-medium mb-4">
                            最近访问的文件
                        </Typography>
                        <FileList files={recentFiles} />
                    </Box>
                )}

                <Box mt={12}>
                    <Typography variant="h5" component="h2" className="font-medium mb-4">
                        热门搜索
                    </Typography>
                    <Grid container spacing={2}>
                        {popularSearches.map((search, index) => (
                            <Grid item key={index}>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleSearch(search.term)}
                                    className="px-4 py-2"
                                >
                                    {search.term} <span className="ml-2 text-sm text-gray-500">{search.count} 次</span>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </PageWrapper>
    );
};

export default HomePage;    
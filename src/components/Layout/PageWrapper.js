import React from 'react';
import { Container, Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { NavigateBefore } from '@mui/icons-material';

const PageWrapper = ({ title, breadcrumbs, children }) => {
    return (
        <Container maxWidth="xl" className="px-4 py-6">
            <Box mb={4}>
                <Breadcrumbs aria-label="breadcrumb" separator={<NavigateBefore fontSize="small" />}>
                    <Link href="/" color="text.primary">
                        首页
                    </Link>
                    {breadcrumbs?.map((crumb, index) => (
                        <Link
                            key={index}
                            href={crumb.href || '#'}
                            color="text.primary"
                            underline="hover"
                        >
                            {crumb.label}
                        </Link>
                    ))}
                    <Typography color="text.secondary">{title}</Typography>
                </Breadcrumbs>
                <Typography variant="h4" className="mt-2 font-medium text-gray-900">
                    {title}
                </Typography>
            </Box>
            {children}
        </Container>
    );
};

export default PageWrapper;    
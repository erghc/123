import React from 'react';
import Dashboard from '../../components/Admin/Dashboard';
import MainLayout from '../../components/Layout/MainLayout';
import PageWrapper from '../../components/Layout/PageWrapper';

const AdminDashboardPage = () => {
    return (
        <MainLayout>
            <PageWrapper title="管理员仪表盘">
                <Dashboard />
            </PageWrapper>
        </MainLayout>
    );
};

export default AdminDashboardPage;    
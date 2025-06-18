import React, { useEffect, useState } from 'react';
import { 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    CardHeader, 
    Divider,
    LinearProgress 
} from '@mui/material';
import { useSelector } from 'react-redux';
import UserTable from './UserTable';
import FileStatsChart from './FileStatsChart';
import { fetchDashboardStats } from '../../api/admin';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await fetchDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" className="mb-6 font-bold">
                管理员仪表盘
            </Typography>
            
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} lg={3}>
                    <Card>
                        <CardHeader title="总用户数" />
                        <Divider />
                        <CardContent>
                            <Typography variant="h3" component="p" className="font-bold">
                                {stats.totalUsers}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                较上周增长 {stats.userGrowth}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                    <Card>
                        <CardHeader title="文件总数" />
                        <Divider />
                        <CardContent>
                            <Typography variant="h3" component="p" className="font-bold">
                                {stats.totalFiles}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                较上周增长 {stats.fileGrowth}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                    <Card>
                        <CardHeader title="搜索次数" />
                        <Divider />
                        <CardContent>
                            <Typography variant="h3" component="p" className="font-bold">
                                {stats.totalSearches}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                今日搜索 {stats.todaySearches}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                    <Card>
                        <CardHeader title="存储使用" />
                        <Divider />
                        <CardContent>
                            <Typography variant="h3" component="p" className="font-bold">
                                {stats.storageUsage} GB
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                共 {stats.totalStorage} GB ({Math.round((stats.storageUsage / stats.totalStorage) * 100)}%)
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            <Grid container spacing={4} className="mt-6">
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardHeader title="文件类型统计" />
                        <Divider />
                        <CardContent>
                            <FileStatsChart fileTypes={stats.fileTypes} />
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardHeader title="最近活动" />
                        <Divider />
                        <CardContent>
                            {/* 活动日志列表 */}
                            {stats.recentActivities.map(activity => (
                                <div key={activity.id} className="mb-4 pb-4 border-b border-gray-100">
                                    <Typography variant="body1" className="font-medium">
                                        {activity.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {activity.time}
                                    </Typography>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            <Grid container spacing={4} className="mt-6">
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="用户管理" />
                        <Divider />
                        <CardContent>
                            <UserTable users={stats.users} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;    
import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';

const FileStatsChart = ({ fileTypes }) => {
    // 准备图表数据
    const chartData = fileTypes.map(type => ({
        name: type.name,
        count: type.count,
        size: type.size / (1024 * 1024) // 转换为MB
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="文件数量" />
                <Bar dataKey="size" fill="#82ca9d" name="文件大小 (MB)" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default FileStatsChart;    
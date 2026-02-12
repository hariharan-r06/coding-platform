import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const ProgressChart = ({ data = [], type = 'doughnut' }) => {
    if (!data || data.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius)' }}>
                No data available yet. Start solving problems!
            </div>
        );
    }

    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                label: 'Problems Solved',
                data: data.map(item => item.count),
                backgroundColor: [
                    '#6366f1',
                    '#ec4899',
                    '#8b5cf6',
                    '#10b981',
                    '#f59e0b',
                    '#3b82f6',
                ],
                borderWidth: 0,
                borderRadius: type === 'bar' ? 8 : 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    usePointStyle: true,
                    padding: 20,
                },
            },
            tooltip: {
                padding: 12,
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#f8fafc',
                borderColor: '#334155',
                borderWidth: 1,
            }
        },
        scales: type === 'bar' ? {
            y: {
                grid: { color: '#334155' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        } : {},
    };

    return (
        <div style={{ width: '100%', height: type === 'doughnut' ? '240px' : '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {type === 'doughnut' ? (
                <Doughnut data={chartData} options={options} />
            ) : (
                <Bar data={chartData} options={options} />
            )}
        </div>
    );
};

export default ProgressChart;

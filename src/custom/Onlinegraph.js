import React, { useState, useEffect } from 'react'
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const Onlinegraph = ({ onlinerevenue }) => {
    console.log("ordersGraph && ordersGraph.map((ele)=>ele.month),", onlinerevenue && onlinerevenue.map((ele) => ele.month),)
    const data = {
        labels: onlinerevenue && onlinerevenue.map((ele) => ele.month),
        datasets: [
            {
                label: 'Revenue',
                data: onlinerevenue && onlinerevenue.map((ele) => ele.totalRevenue),
                fill: false,
                borderColor: '#68033f',
                tension: 0.1
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (

        <div style={{ width: '458px', height: '400px' }}>
            <Line data={data} options={options} />
        </div>
    )
}

export default Onlinegraph
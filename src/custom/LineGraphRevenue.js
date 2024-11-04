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

const LineGraphRevenue = ({ ordersGraph }) => {

  console.log("ordersGraph && ordersGraph.map((ele)=>ele.month),", ordersGraph && ordersGraph.map((ele) => ele.month),)
  const data = {
    labels: ordersGraph && ordersGraph.map((ele) => ele.month),
    datasets: [
      {
        label: 'Revenue',
        data: ordersGraph && ordersGraph.map((ele) => ele.totalRevenue),
        fill: false,
        borderColor: '#d7783b',
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
    <>
      <div style={{ width: '506px', height: '400px' }}>
        <Line data={data} options={options} />
      </div>
    </>
  )
}

export default LineGraphRevenue
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, createRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const ChartComponent = ({
  labels,
  channel1Data,
  labelChannel1,
}) => {
  const [data, setChartData] = useState({});
  const chartRef = createRef();

  const datasets = [];

  const addChannelData = () => {
    if (channel1Data.length > 0) {
      datasets.push({
        fill: false,
        label: labelChannel1,
        lineTension: 0.2,
        borderColor: 'rgba(0, 167, 225, 255)',
        borderWidth: 3,
        backgroundColor: 'rgba(0, 167, 225, 255)',
        data: channel1Data,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        hidden: true,
      });
      setChartData({
        labels,
        datasets,
      });
    }
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  useEffect(() => {
    addChannelData();
  }, [channel1Data]);

  return (
    <div className="chart-container">
      {data.datasets ? <Line ref={chartRef} data={data} width={496} height={248} options={options} /> : null}
    </div>
  );
};

ChartComponent.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.any).isRequired,
  labelChannel1: PropTypes.string.isRequired,
  channel1Data: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default ChartComponent;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, createRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const LineChart = ({
  labels,
  channel1Data,
  channel2Data,
  channelTotalsData,
  labelChannel1,
  labelChannel2,
  labelChannelTotal,
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
    }
    if (channel2Data.length > 0) {
      datasets.push({
        fill: false,
        label: labelChannel2,
        lineTension: 0.2,
        borderColor: 'rgba(235,169,0,255)',
        borderWidth: 3,
        backgroundColor: 'rgba(235, 169, 0, 255)',
        data: channel2Data,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        hidden: true,
      });
    }
    if (channelTotalsData.length > 0) {
      datasets.push({
        fill: false,
        label: labelChannelTotal,
        lineTension: 0.2,
        borderColor: 'rgba(7, 44, 115, 255)',
        borderWidth: 3,
        backgroundColor: 'rgba(7, 44, 115, 255)',
        data: channelTotalsData,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        hidden: false,
      });
    }
  };

  const ecoCounterChart = () => {
    setChartData({
      labels,
      datasets,
    });
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
    ecoCounterChart();
  }, [channelTotalsData]);

  useEffect(() => {
    addChannelData();
  }, [channel1Data, channel2Data]);

  return (
    <div className="chart-container">
      {data.datasets ? <Line ref={chartRef} data={data} width={496} height={248} options={options} /> : null}
    </div>
  );
};

LineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.any).isRequired,
  labelChannel1: PropTypes.string.isRequired,
  labelChannel2: PropTypes.string.isRequired,
  labelChannelTotal: PropTypes.string.isRequired,
  channel1Data: PropTypes.arrayOf(PropTypes.any).isRequired,
  channel2Data: PropTypes.arrayOf(PropTypes.any).isRequired,
  channelTotalsData: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default LineChart;

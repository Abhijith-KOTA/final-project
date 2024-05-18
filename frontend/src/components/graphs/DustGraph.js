import React from "react";
// eslint-disable-next-line
import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';

const DustChart = ({graphdata}) => {
    const labels = graphdata.map((data) => data.hour);

const data = {
labels: labels,
datasets: [
    {
        label: "Dust",
        backgroundColor: "red",
        borderColor: "red",
        data: graphdata.map((data) => data.pm2_5_hourly_average),
    }],
};

return (
<div>
<Line data={data} className="graph" />
</div>
);
};
export default DustChart;

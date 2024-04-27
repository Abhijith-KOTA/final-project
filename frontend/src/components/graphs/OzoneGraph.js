import React from "react";
// eslint-disable-next-line
import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';

const OzoneChart = ({graphdata}) => {
    const labels = graphdata.map((data) => data.time);
    
    const data = {
    labels: labels,
    datasets: [
        {
            label: "Ozone",
            backgroundColor: "red",
            borderColor: "red",
            data: graphdata.map((data) => data.Ozone),
        }],
    };

    return (
    <div>
        <Line data={data} className="graph" />
    </div>
    );
};
export default OzoneChart;

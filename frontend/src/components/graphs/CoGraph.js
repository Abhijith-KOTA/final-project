import React from "react";
// eslint-disable-next-line
import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';

const COChart = ({graphdata}) => {
    const labels = graphdata.map((data) => data.time);
    
    const data = {
    labels: labels,
    datasets: [
        {
            label: "CO",
            backgroundColor: "red",
            borderColor: "red",
            data: graphdata.map((data) => data.CO),
        }],
    };

    return (
    <div>
        <Line data={data} className="graph" />
    </div>
    );
};
export default COChart;

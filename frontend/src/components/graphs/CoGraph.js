import React from "react";
// eslint-disable-next-line
import Chart from "chart.js/auto";
import { Bar } from 'react-chartjs-2';

const COChart = ({graphdata}) => {
    if (graphdata === null){
        return null
    }
    const labels = graphdata.map((data) => data.hour);
    
    const data = {
    labels: labels,
    datasets: [
        {
            label: "CO",
            backgroundColor: "red",
            borderColor: "red",
            data: graphdata.map((data) => data.CO_hourly_average),
        }],
    };

    return (
    <div>
        <Bar data={data} className="graph" />
    </div>
    );
};
export default COChart;

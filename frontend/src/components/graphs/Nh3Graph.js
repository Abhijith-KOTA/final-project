import React from "react";
// eslint-disable-next-line
import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';

const Nh3Chart = ({graphdata}) => {
    const labels = graphdata.map((data) => data.time);
    
    const data = {
    labels: labels,
    datasets: [
        {
            label: "NH3",
            backgroundColor: "red",
            borderColor: "red",
            data: graphdata.map((data) => data.NH3),
        }],
    };

    return (
    <div>
        <Line data={data} className="graph" />
    </div>
    );
};
export default Nh3Chart;

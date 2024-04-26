import { useState } from "react";
import LineChart from "./LineChart";

function DustGraph(data) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "PM2.5",
                data: data.pm2_5,
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }
        ]
    });
}
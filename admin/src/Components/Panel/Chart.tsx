import { useContext, useRef } from "react";
import Chart, { ChartConfiguration, GridLineOptions } from "chart.js/auto";

import { StoreContext } from "../../context/StoreContext";

const Graph = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const context = useContext(StoreContext);
  if (!context) return <div>refresh the page.......</div>;

  const { monthlyData } = context;

  console.log(monthlyData);

  const updateChartData = (monthData: number[]) => {
    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Sales ($)",
            fill: true,
            backgroundColor: "rgba(0, 123, 255, 0.2)",
            borderColor: "#007bff",
            data: monthData,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            intersect: false,
          },
          filler: {
            propagate: true,
          },
        },
        scales: {
          x: {
            reverse: true,
            grid: {
              display: false,
            },
          },
          y: {
            ticks: {
              stepSize: 1000,
            },
            grid: {
              borderDash: [3, 3], // Set dash pattern
              display: true,
            } as Partial<GridLineOptions>,
          },
        },
      },
    };

    if (chartInstanceRef.current) {
      // If the chart instance already exists, update its data
      chartInstanceRef.current.data = config.data;
      chartInstanceRef.current.update();
    } else {
      // If no chart instance, create one
      const ctx = chartRef.current?.getContext("2d");
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, config);
      }
    }
  };

  updateChartData(monthlyData);
  return (
    <div className="container">
      <div className="card flex-fill w-100 draggable">
        <div className="card-header">
          <h5 className="card-title mb-0">Recent Movement</h5>
        </div>
        <div className="card-body py-3">
          <div className="chart chart-sm">
            <canvas
              ref={chartRef}
              style={{ display: "block", height: "252px", width: "100%" }}
              className="chart-line"
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;

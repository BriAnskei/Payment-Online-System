import React, { useContext, useEffect, useRef } from "react";
import Chart, { ChartConfiguration, GridLineOptions } from "chart.js/auto";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Graph = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const context = useContext(StoreContext);
  if (!context) return <div>refresh the page.......</div>;

  const { serverUrl } = context;

  useEffect(() => {
    async function fetchData() {
      const response = await axios.post(
        `${serverUrl}/api/payments/paidlist`,
        {}
      );

      if (response.data.success) {
        const paymentList = response.data.data;

        const monthlyData = new Array(12).fill(0);

        paymentList.forEach((payment: { date: string; amount: number }) => {
          const month = new Date(payment.date).getMonth();
          monthlyData[month] += payment.amount;
        });

        updateChartData(monthlyData);
      } else {
        console.log("Error");
      }
    }
    fetchData();
  }, []);

  const updateChartData = (monthlyData: number[]) => {
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
            data: monthlyData,
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

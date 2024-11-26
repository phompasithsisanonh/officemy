import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Heading, Spinner } from "@chakra-ui/react";
import axios from "axios";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Total Balance by Month",
        color: "#111",
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/listAll");
        setData(response.data.products);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data to aggregate balances by month
  const monthlyBalances = {};

  data.forEach((item) => {
    const dateObj = new Date(item.date);
    if (!isNaN(dateObj)) {
      const month = monthNames[dateObj.getMonth()];
      if (!monthlyBalances[month]) {
        monthlyBalances[month] = 0;
      }
      monthlyBalances[month] += item.total || 0; // Adjust field name if necessary
    
    }
  });

  // Prepare data for the chart
  const labels = monthNames.sort(
    (a, b) => monthNames.indexOf(a) - monthNames.indexOf(b)
  );
  const balances = labels.map((month) => monthlyBalances[month] || 0);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Balance",
        data: balances,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Heading
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        ພາບລວມຂອງການວິເຄາະຖານຂໍ້ມູນ
      </Heading>
      <Box style={{ width: "60%", margin: "0 auto", padding: "20px" }}>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Bar options={options} data={chartData} />
        )}
      </Box>
    </div>
  );
}

export default Dashboard;

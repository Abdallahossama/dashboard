// Initial chart setup
const ctx = document.getElementById("myChart").getContext("2d");
const barCtx1 = document.getElementById("bar").getContext("2d");
const pieCtx1 = document.getElementById("pie").getContext("2d");
const barCtx2 = document.getElementById("bar2").getContext("2d");
const pieCtx2 = document.getElementById("pie2").getContext("2d");

// Heat map
// dummy data
const ctxData = {
  labels: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
  datasets: [
    {
      label: "Total ",
      data: [60, 60, 70, 30, 50, 40, 70], // Dummy data
      backgroundColor: "#5b7af9",
      borderColor: "#5b7af9",
      borderWidth: 1,
      borderRadius: 5,
    },
  ],
};

const barData1 = {
  labels: ["1-15", "16-25", "26-40", "41-60", "Above 60"],
  datasets: [
    {
      label: "",
      data: [65, 59, 80, 81, 56],
      backgroundColor: ["#2dd0c1", "#5b7af9", "#ff7557", "#fe9b49", "#9c71f5"],
      borderColor: ["#2dd0c1", "#5b7af9", "#ff7557", "#fe9b49", "#9c71f5"],
      borderWidth: 1,
      borderRadius: 2,
    },
  ],
};

const pieData1 = {
  labels: ["1-15", "16-25", "26-40", "41-60", "Above 60"],
  datasets: [
    {
      data: [60, 40, 30, 10, 20],
      backgroundColor: ["#2dd0c1", "#5b7af9", "#ff7557", "#fe9b49", "#9c71f5"],
    },
  ],
};

const barData2 = {
  labels: ["Men", "Women", "Kids"],
  datasets: [
    {
      label: "",
      data: [70, 55, 90],
      backgroundColor: ["#2dd0c1", "#5b7af9", "#ff7557"],
      borderColor: ["#2dd0c1", "#5b7af9", "#ff7557"],
      borderWidth: 1,
      borderRadius: 2,
    },
  ],
};

const pieData2 = {
  labels: ["Male", "Female", "Kids"],
  datasets: [
    {
      data: [55, 45, 20],
      label: "%",
      backgroundColor: ["#2dd0c1", "#5b7af9", "#ff7557"],
    },
  ],
};

const chart = new Chart(ctx, {
  type: "bar",
  data: ctxData,
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.dataset.label + ": " + tooltipItem.raw; // Add % to tooltip
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 80, // Set y-axis max to 100
        ticks: {
          callback: function (value) {
            return value + ""; // Append '%' symbol to y-axis values
          },
        },
      },
      x: {
        ticks: {
          font: {
            style: "normal",
          },
        },
      },
    },
  },
});

const barChart1 = new Chart(barCtx1, {
  type: "bar",
  data: barData1,
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.dataset.label + ": " + tooltipItem.raw + " %"; // Add % to tooltip
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set y-axis max to 100
        ticks: {
          callback: function (value) {
            return value + "%"; // Append '%' symbol to y-axis values
          },
        },
      },
      x: {
        ticks: {
          font: {
            style: "normal",
          },
        },
      },
    },
  },
});

const pieChart1 = new Chart(pieCtx1, {
  type: "pie",
  data: pieData1,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Gender Distribution",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + " %"; // Add % to tooltip
          },
        },
      },
    },
  },
});

const barChart2 = new Chart(barCtx2, {
  type: "bar",
  data: barData2,
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.dataset.label + ": " + tooltipItem.raw + " %"; // Add % to tooltip
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set y-axis max to 100
        ticks: {
          callback: function (value) {
            return value + "%"; // Append '%' symbol to y-axis values
          },
        },
      },
      x: {
        ticks: {
          font: {
            style: "normal",
          },
        },
      },
    },
  },
});

const pieChart2 = new Chart(pieCtx2, {
  type: "pie",
  data: pieData2,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Gender Distribution",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + " %"; // Add % to tooltip
          },
        },
      },
    },
  },
});

// Function to get data and update charts
const getData = (startDate, endDate) => {
  document.getElementById("foot").textContent = "Foot Traffic Heatmap";
  fetch(
    `https://testapi.6lb.menu/api/PedestriansReports?startDate=${startDate}&endDate=${endDate}`
  )
    .then((response) => response.json())
    .then((data) => {
      const dates = data.days.map((day) => day.date);
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const footTrafficMatrix = Array.from({ length: 24 }, () =>
        Array(dates.length).fill(0)
      );

      data.days.forEach((day, dayIndex) => {
        day.reportByHour.forEach((report) => {
          footTrafficMatrix[report.hour][dayIndex] =
            report.totalMen + report.totalWomen + report.totalKids;
        });
      });

      const heatmapData = [
        {
          z: footTrafficMatrix,
          x: dates,
          y: hours,
          type: "heatmap",
          colorscale: [
            [0, "rgb(173, 216, 230)"], // very light blue
            [0.09, "rgb(173, 216, 230)"], // very light blue
            [0.1, "rgb(135, 206, 250)"], // light blue
            [0.18, "rgb(135, 206, 250)"], // light blue
            [0.2, "rgb(0, 0, 255)"], // blue
            [0.36, "rgb(0, 0, 255)"], // blue
            [0.4, "rgb(0, 0, 139)"], // dark blue
            [0.72, "rgb(0, 0, 139)"], // dark blue
            [0.8, "rgb(255, 0, 0)"], // red
            [0.91, "rgb(255, 0, 0)"], // red
            [1.0, "rgb(139, 0, 0)"], // dark red
          ],
          reversescale: false,
          colorbar: {
            title: "Foot Traffic",
          },
          text: footTrafficMatrix.map((row) =>
            row.map((val) => val.toString())
          ),
          hoverinfo: "text",
        },
      ];

      const annotations = [];
      for (let i = 0; i < hours.length; i++) {
        for (let j = 0; j < dates.length; j++) {
          annotations.push({
            x: dates[j],
            y: hours[i],
            text: footTrafficMatrix[i][j],
            showarrow: false,
            font: {
              color: "white",
              size: 12,
              family: "Arial",
              weight: "bold",
            },
          });
        }
      }

      const layout = {
        title: "Foot Traffic Heatmap",
        xaxis: {
          title: "Date",
        },
        yaxis: {
          title: "Hour",
          dtick: 1,
          tickmode: "linear",
        },
        annotations: annotations,
      };

      Plotly.newPlot("heatmap", heatmapData, layout);
    });
  axios
    .get(
      `https://testapi.6lb.menu/api/PedestriansReports?startDate=${startDate}&endDate=${endDate}`
    )
    .then((res) => {
      console.log(res.data);
      let totalPedestrians =
        res.data.totalMen + res.data.totalWomen + res.data.totalKids;
      let totalLockedAtScreen =
        res.data.totalAttentionByKids +
        res.data.totalAttentionByMen +
        res.data.totalAttentionByWomen;
      // Get data for gender
      let totalMen = res.data.totalMen;
      let totalWomen = res.data.totalWomen;
      let totalKids = res.data.totalKids;
      let totalOverall = totalMen + totalWomen + totalKids;
      // Get data for each age group
      let totalNumberOf1To15 = res.data.totalNumberOf1To15;
      let totalNumberOf16To25 = res.data.totalNumberOf16To25;
      let totalNumberOf26To40 = res.data.totalNumberOf26To40;
      let totalNumberOf41To60 = res.data.totalNumberOf41To60;
      let totalNumberOfAbove60 = res.data.totalNumberOfAbove60;
      let totalAge =
        totalNumberOf1To15 +
        totalNumberOf16To25 +
        totalNumberOf26To40 +
        totalNumberOf41To60 +
        totalNumberOfAbove60;
      // get data for attention by gender
      let totalMenAttention = res.data.totalAttentionByMen;
      let totalWomenAttention = res.data.totalAttentionByWomen;
      let totalKidsAttention = res.data.totalAttentionByKids;

      let newLabels = [];
      const newData = [];
      const percentages = [];
      const hours = [];
      let formattedDate = [];

      if (startDate === endDate) {
        // Single day data handling
        const singleDayData = res.data.days[0]; // Assuming there's only one day in the array

        let total = 0;

        singleDayData.reportByHour.forEach((hourData) => {
          const hour = hourData.hour;
          const hourTotal =
            hourData.totalMen + hourData.totalWomen + hourData.totalKids;
          newLabels.push(`${hour}:00`);
          newData.push(hourTotal);
        });
      } else {
        // Multiple days data handling
        res.data.days.forEach((day) => {
          formattedDate = day.date.toString().split("T")[0];
          newLabels.push(formattedDate); // Push formatted date to labels
          hours.push(day.reportByHour);

          const total = day.totalMen + day.totalWomen + day.totalKids;
          newData.push(total);
        });
      }

      document.getElementById("totalPedestrians").innerHTML = totalPedestrians;
      document.getElementById("man").innerHTML = totalMen;
      document.getElementById("women").innerHTML = totalWomen;
      document.getElementById("kids").innerHTML = totalKids;

      // Calculate percentages for each day
      newData.forEach((dayTotal) => {
        const percentage = ((dayTotal / totalOverall) * 100).toFixed(2);
        percentages.push(percentage);
      });

      // Calculate percentages for categories
      const percentageMen = (
        (totalMen / (totalMen + totalWomen)) *
        100
      ).toFixed(2);
      const percentageWomen = (
        (totalWomen / (totalMen + totalWomen)) *
        100
      ).toFixed(2);
      // Calculate percentages for each age group
      const percentageOf1To15 = ((totalNumberOf1To15 / totalAge) * 100).toFixed(
        2
      );
      const percentage16To25 = ((totalNumberOf16To25 / totalAge) * 100).toFixed(
        2
      );
      const percentageOf26To40 = (
        (totalNumberOf26To40 / totalAge) *
        100
      ).toFixed(2);
      const percentageOf41To60 = (
        (totalNumberOf41To60 / totalAge) *
        100
      ).toFixed(2);
      const percentageOfAbove60 = (
        (totalNumberOfAbove60 / totalAge) *
        100
      ).toFixed(2);
      // Calculate percentages for total Attention
      const percentageMenAttention = (
        (totalMenAttention / totalLockedAtScreen) *
        100
      ).toFixed(2);
      const percentageWomenAttention = (
        (totalWomenAttention /
          (res.data.totalAttentionByMen + res.data.totalAttentionByWomen)) *
        100
      ).toFixed(2);
      const percentageKidsAttention = (
        (totalKidsAttention /
          (res.data.totalAttentionByMen + res.data.totalAttentionByWomen)) *
        100
      ).toFixed(2);
      const maxYValue = Math.max(...newData);
      // Update charts data and labels
      chart.data.labels = newLabels;
      chart.data.datasets[0].data = newData; // Use percentages for ctx chart
      chart.options.scales.y.max = maxYValue; // Use percentages for ctx chart

      // Additional logic to update other charts
      barChart1.data.datasets[0].data = [
        percentageOf1To15,
        percentage16To25,
        percentageOf26To40,
        percentageOf41To60,
        percentageOfAbove60,
      ]; // Example update
      pieChart1.data.datasets[0].data = [
        percentageOf1To15,
        percentage16To25,
        percentageOf26To40,
        percentageOf41To60,
        percentageOfAbove60,
      ]; // Example update
      barChart2.data.datasets[0].data = [
        percentageMenAttention,
        percentageWomenAttention,
        percentageKidsAttention,
      ]; // Example update
      pieChart2.data.datasets[0].data = [
        percentageMenAttention,
        percentageWomenAttention,
        percentageKidsAttention,
      ]; // Example update

      // Update the charts with new data
      chart.update();
      barChart1.update();
      pieChart1.update();
      barChart2.update();
      pieChart2.update();

      // Display percentages
      displayGenderPercentages1(
        percentageOf1To15,
        percentage16To25,
        percentageOf26To40,
        percentageOf41To60,
        percentageOfAbove60
      );
      displayGenderPercentages2(
        percentageMenAttention,
        percentageWomenAttention,
        percentageKidsAttention
      );
      // Animate counters with new data
      animateCounter("man", 0, totalMen, 600); // Animate with actual totalMen value
      animateCounter("women", 0, totalWomen, 600); // Animate with actual totalWomen value
      animateCounter("kids", 0, totalKids, 600); // Animate with actual totalKids value
      animateCounter("totalPedestrians", 0, totalPedestrians, 600);
      animateCounter("totalLockedAtScreen", 0, totalLockedAtScreen, 600);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Function to display gender percentages next to the pie charts
function displayGenderPercentages1(
  percentageOf1To15,
  percentage16To25,
  percentageOf26To40,
  percentageOf41To60,
  percentageOfAbove60
) {
  const percentagesContainer = document.getElementById("gender-percentage");
  percentagesContainer.innerHTML = ""; // Clear previous content

  const from1To15 = document.createElement("p");
  from1To15.textContent = `1To15: ${percentageOf1To15}%`;
  from1To15.style.color = "#2dd0c1"; // Color for men
  from1To15.style.fontWeight = "500";

  const from16To25 = document.createElement("p");
  from16To25.textContent = `16-25: ${percentage16To25}%`;
  from16To25.style.color = "#5b7af9"; // Color for women
  from16To25.style.fontWeight = "500";

  const from26To40 = document.createElement("p");
  from26To40.textContent = `26-40: ${percentageOf26To40}%`;
  from26To40.style.color = "#ff7557"; // Color for women
  from26To40.style.fontWeight = "500";

  const from41To60 = document.createElement("p");
  from41To60.textContent = `41-60: ${percentageOf41To60}%`;
  from41To60.style.color = "#fe9b49"; // Color for women
  from41To60.style.fontWeight = "500";

  const above60 = document.createElement("p");
  above60.textContent = `Above 60: ${percentageOfAbove60}%`;
  above60.style.color = "#9c71f5"; // Color for women
  above60.style.fontWeight = "500";

  percentagesContainer.appendChild(from1To15);
  percentagesContainer.appendChild(from16To25);
  percentagesContainer.appendChild(from26To40);
  percentagesContainer.appendChild(from41To60);
  percentagesContainer.appendChild(above60);
}

function displayGenderPercentages2(
  percentageMen,
  percentageWomen,
  percentageKidsAttention
) {
  const percentagesContainer = document.getElementById("gender-percentage2");
  percentagesContainer.innerHTML = ""; // Clear previous content

  const percentageMenElem = document.createElement("p");
  percentageMenElem.textContent = `Men: ${percentageMen}%`;
  percentageMenElem.style.color = "#2fa9ff"; // Color for men
  percentageMenElem.style.fontWeight = "500";

  const percentageWomenElem = document.createElement("p");
  percentageWomenElem.textContent = `Women: ${percentageWomen}%`;
  percentageWomenElem.style.color = "#ff7557"; // Color for women
  percentageWomenElem.style.fontWeight = "500";

  const percentageKidsElem = document.createElement("p");
  percentageKidsElem.textContent = `Kids: ${percentageWomen}%`;
  percentageKidsElem.style.color = "#fe9b49"; // Color for women
  percentageKidsElem.style.fontWeight = "500";

  percentagesContainer.appendChild(percentageMenElem);
  percentagesContainer.appendChild(percentageWomenElem);
  percentagesContainer.appendChild(percentageKidsElem);
}

// Initialize date range picker
$(function () {
  $("#dateRangePicker").daterangepicker(
    {
      opens: "left",
      locale: {
        format: "YYYY-MM-DD",
      },
    },
    function (start, end, label) {
      const startDate = start.format("YYYY-MM-DD");
      const endDate = end.format("YYYY-MM-DD");

      // Fetch and update charts with new data
      getData(startDate, endDate);
    }
  );
});

// Animation
function animateCounter(elementId, startValue, endValue, duration) {
  const element = document.getElementById(elementId);
  let startTime = null;

  function updateCounter(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const currentValue = Math.floor(
      progress * (endValue - startValue) + startValue
    );
    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = endValue; // Ensure the final value is set
    }
  }

  requestAnimationFrame(updateCounter);
}

animateCounter("man", 0, 1832, 600); // ID, startValue, endValue, duration in milliseconds
animateCounter("women", 0, 2429, 600);
animateCounter("kids", 0, 120, 600);
animateCounter("totalPedestrians", 0, 4362, 600);
animateCounter("totalLockedAtScreen", 0, 42, 600);

// dummy data
displayGenderPercentages1(50, 50, 50, 25, 70);
displayGenderPercentages2(50, 50, 50);

//////////////

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Parameters
let chosenXAxis = "poverty";

// // Function for updating x-scale upon click on axis scale
// function xScale(usData, chosenXAxis) {
//     // create scales
//     const XLinearScale = d3.scaleLinear()
//         .domain([d3.min(usData, d=> d[chosenXAxis])* 0.8,
//             d3.max(usData, d => d[chosenXAxis]) *1.2
//         ])
//         .range([0, width]);
//     return XLinearScale;

// }

//function used for updating xAxis const upon click on axis label
// function renderAxes(newXscale, xAxis) {
//     const bottomAxis = d3.axisBottom(newXscale);

//     xAxis.transition()
//         .duration(1000)
//         .call(bottomAxis);
//     return xAxis;

// }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXaxis) {

//     circlesGroup.transition()
//       .duration(1000)
//       .attr("cx", d => newXScale(d[chosenXAxis]));
  
//     return circlesGroup;
//   }

d3.csv("assets/data/data.csv").then(function(usData) {

    usData.forEach(function(data){
    usData.id = +usData.id;
    usData.state = usData.state;
    usData.poverty = +usData.poverty;
    usData.povertyMoe = +usData.povertyMoe;
    usData.age = +usData.age;
    usData.ageMoe = +usData.ageMoe;
    usData.income = +usData.income;
    usData.incomeMoe = +usData.incomeMoe;
    usData.healthcare = +usData.healthcare;
    usData.healthcareLow = +usData.healthcareLow;
    usData.healthcareHigh = +usData.healthcareHigh;
    usData.obesity = +usData.obesity;
    usData.obesityLow = +usData.obesityLow;
    usData.obesityHigh = +usData.obesityHigh;
    usData.smokes = +usData.smokes;
    usData.smokesLow = +usData.smokesLow;
    usData.smokesHigh = +usData.smokesHigh;
    })

    // Step 5: Create Scales
    //= ============================================

    const xLinearScale1 = d3.scaleLinear()
    .domain(d3.extent(usData, d => d.poverty))
    .range([0, chartWidth]);

    const yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(usData, d => d.income)])
    .range([chartHeight, 0]);

    // Step 6: Create Axes
    // =============================================
    const bottomAxis = d3.axisBottom(xLinearScale1);//.tickFormat(d3.timeFormat("%d-%b-%Y"));
    const leftAxis = d3.axisLeft(yLinearScale1);

    // Step 7: Append the axes to the chartGroup - ADD STYLING
    // ==============================================
    // Add bottomAxis

    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    chartGroup.append("g")
        .attr("stroke", "green")
        .call(leftAxis);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    // chartGroup.append("g")
    //     .attr("transform", `translate(${chartWidth}, 0)`)
    //     .attr("stroke", "blue")
    //     .call(leftAxis);

    // Step 8: Set up two line generators and append two SVG paths
    // ==============================================
    // Line generators for each line

    chartGroup.selectAll("circle")
    .data(usData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale1(d.poverty))
    .attr("cy", d => yLinearScale1(d.income))
    .attr("r", 20)
    .attr("fill", "gray")
    .attr("opacity", ".5");
});
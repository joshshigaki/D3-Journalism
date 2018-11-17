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
var svg = d3.select("scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Parameters
let chosenXAxis = "poverty";

// Function for updating x-scale upon click on axis scale
function xScale(usData, chosenXAxis) {
    // create scales
    const XLinearScale = d3.scaleLinear()
        .domain([d3.min(hairData, d=> d[chosenXAxis])* 0.8,
            d3.max(usData, d => d[chosenXAxis]) *1.2
        ])
        .range([0, width]);
    return XLinearScale;

}

//function used for updating xAxis const upon click on axis label
function renderAxes(newXscale, xAxis) {
    const bottomAxis = d3.axisBottom(newXscale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;

}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

d3.csv("./assets/data/data.csv", function(error, usData) {

    // Return an error if one occurs
    //if (error) return console.warn(error);
    if (error) throw error;

    // console.log(usData);
    // Print the data

    usData.forEach(function(data) {
        // data.id = +data.id;
        data.state = data.state;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        // data.age = +data.age;
        // data.ageMoe = +data.ageMoe;
        // data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        // data.obesity = +data.obesity;
        // data.obesityLow = +data.obesityLow;
        // data.obesityHigh = +data.obesityHigh;
        // data.smokes = +data.smokes;
        // data.smokesLow = +data.smokesLow;
        // data.smokesHigh = +data.smokesHigh; 
    });
});
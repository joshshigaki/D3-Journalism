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

// Set initial X and Y axis
let chosenXAxis = "poverty";
let chosenYAxis = "obesity";

// function used for updating x-scale const upon click on axis label
function xScale(usData, chosenXAxis) {
  // create scales
  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(usData, d => d[chosenXAxis]) * 0.8,
      d3.max(usData, d => d[chosenXAxis]) * 1.2])
    .range([0, chartWidth]);
  return xLinearScale;
};

// function used for updating y-scale const upon click on axis label
function yScale(usData, chosenYAxis) {
  // create scales
  const yLinearScale = d3.scaleLinear()
    .domain([d3.min(usData, d => d[chosenYAxis]) * 0.8,
      d3.max(usData, d => d[chosenYAxis]) * 1.2])
    .range([0, chartHeight]);
  return yLinearScale;
};

// function used for updating xAxis const upon click on axis label
function renderXAxes(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis const upon click on axis label
function renderYAxes(newYScale, yAxis) {
  const leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  const toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, -60])
    .html(function(d) {
      return (`X: ${d[chosenXAxis]}<br> Y: ${d[chosenYAxis]}`); // to change the format of the tooltip
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(usData) {
    usData.forEach(function(data){
      data.id = +data.id;
      data.state = data.state;
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
    })

    // Step 5: Create Scales
    //= ============================================
    let xLinearScale = xScale(usData, chosenXAxis);
    let yLinearScale = yScale(usData, chosenYAxis);

    // Step 6: Create Axes
    // =============================================
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // Step 7: Append the axes to the chartGroup - ADD STYLING
    // ==============================================
    // Add bottomAxis

    let xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    // The text for the left Y axis
    let yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

  // Step 8: Generate Scatter Plot
  // ==============================================
    let circlesGroup = chartGroup.selectAll("circle")
      .data(usData)
      .enter()

      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 10)
      .attr("class", "stateCircle");

    // Create group for x axis
      const labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    
    // Labels for toggles
    const povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("Poverty");

    const ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("value", "age") 
      .classed("inactive", true)
      .text("Age (Median)");

    const incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "income")
      .classed("inactive", true)
      .text("Household Income");

    const healthcareLabel = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -200)
      .attr("value", "healthcare") 
      .classed("inactive", true)
      .text("Lacks Healthcare %");

      const smokesLabel = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -200)
      .attr("value", "smokes") 
      .classed("inactive", true)
      .text("Smokes %");

      const obesityLabel = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", -200)
      .attr("value", "obesity") 
      .classed("active", true)
      .text("Obese %");

    // updateToolTip function above csv import
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    const value = d3.select(this).attr("value");
    if (value === "poverty" || "age" || "income") {

      // replaces chosenXaxis with value
      chosenXAxis = value;
      
      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(usData, chosenXAxis);

      // updates axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else if (chosenXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }


    }
    else if (value === "obesity" || "smokes" || "healthcare" ) {

      // replaces chosenXaxis with value
      chosenYAxis = value;
      
      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(usData, chosenYAxis);

      // updates axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else if (chosenYAxis === "smokes") {
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else {
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }


    }

  });

  
});
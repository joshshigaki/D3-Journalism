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

let chosenXAxis = "poverty";

// function used for updating x-scale const upon click on axis label
function xScale(usData, chosenXAxis) {
  // create scales
  const xLinearScale1 = d3.scaleLinear()
    .domain([d3.min(usData, d => d[chosenXAxis]) * 0.8,
      d3.max(usData, d => d[chosenXAxis]) * 1.2])
    .range([0, chartWidth]);
  return xLinearScale1;
};

// function used for updating xAxis const upon click on axis label
function renderAxes(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);

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

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  let label = "# of Albums:";
  if (chosenXAxis === "poverty") {
    label = "Hair Length:";
  }

  const toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, -60])
    .html(function(d) {
      return (`X: ${d[chosenXAxis]}<br> Y: ${d.income}`);
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

    const yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(usData, d => d.healthcare)])
    .range([chartHeight, 0]);

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
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 10)
      .attr("class", "stateCircle");

    // circlesGroup = circlesGroup
    //   .append("text")
    //   .text(`${usData.state}`)

    let circlesText = circlesGroup.selectAll("text")
      .append("text")
      .attr("dx", 1)
      .attr("dy", 1)
      .text(`${usData.state}`)

    // Create group for  2 x- axis labels
      const labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    
    const povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true);

    const incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Income");

    const healthcareLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -300)
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Number of Billboard 500 Hits");

    // updateToolTip function above csv import
  circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    const value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXaxis with value
      chosenXAxis = value;
      
      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(usData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
    // labelsGroup.selectAll("text")
    // .data(usData)
    // .enter()
    // .append("text")
    // .attr("text", function(data) {
    //   return data.state;

  });
});
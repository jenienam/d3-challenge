// @TODO: YOUR CODE HERE!
//You need to create a scatter plot between two of the data variables 
//such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

let svgWidth = 960;
let svgHeight = 500;

var margin = {
    top: 60,
    right: 60,
    bottom: 120,
    left: 150
  };
let plot_height = svgHeight - margin.top - margin.bottom;
let plot_width = svgWidth - margin.left - margin.right;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Import Data
d3.csv("assets/data/data.csv").then(function(analyze_data) {
      // Step 1: Parse Data/Cast as numbers
    // ==============================
    analyze_data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
      });
//scale
    let xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(analyze_data, data => data.poverty)])
        .range([0, plot_width]);

    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(analyze_data, data => data.obesity)])
        .range([plot_height, 0]);

  // Step 3: Create axis functions
    // ==============================
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${plot_height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    let circlesGroup = chartGroup.selectAll("circle")
        .data(analyze_data)
        .enter()
        .append("circle")
        .attr("cx", data => xLinearScale(data.poverty))
        .attr("cy", data => yLinearScale(data.obesity))
        .attr("r", "15")

     // Step 6: Create text label for circles
    // ===============================
    let text_labels = chartGroup.selectAll("circle")
        .data(analyze_data)
        .enter()
        .append("text")
        .text(data => data.abbr)
        .attr("class", "stateText")
        .attr("dx", data => xLinearScale(data.poverty))
        .attr("dy", data => yLinearScale(data.obesity))
    

    // Step 6: Initialize tool tip
    // ==============================
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(data) {
        return (`${data.state}<br>Poverty: ${data.poverty}<br>Obesity: ${data.obesity}`);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (plot_height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage of Obesity: ");

    chartGroup.append("text")
      .attr("transform", `translate(${plot_width / 2}, ${plot_height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Percentage of Poverty");
 }).catch(function(error) {
    console.log(error);
    });
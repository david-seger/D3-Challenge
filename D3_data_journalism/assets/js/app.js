// Welcome to the newsroom! You've just accepted a data visualization position for a major metro paper. 
// You're tasked with analyzing the current trends shaping people's lives, as well as creating charts, 
// graphs, and interactive elements to help readers understand your findings.  The editor wants to run a 
// series of feature stories about the health risks facing particular demographics. She's counting on 
// you to sniff out the first story idea by sifting through information from the U.S. Census Bureau 
// and the Behavioral Risk Factor Surveillance System.  The data set included with the assignment is 
// based on 2014 ACS 1-year estimates from the US Census Bureau, but you are free to investigate a 
// different data set. The current data set includes data on rates of income, obesity, poverty, etc. 
// by state. MOE stands for "margin of error."

// Set SVG Width & Height

let svgWidth = 1000;
let svgHeight = 500;

// Set Margins

let margin = {
    top: 50,
    right: 50,
    left: 50,
    bottom: 50
};

// Chart Area - Margins

let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

// Create SVG Container

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Shift everything over by the margins

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

// Import Data from the data.csv file

d3.csv("assets/data/data.csv").then(function(healthCareData) {
    healthCareData.forEach(function(data) {
        // Make sure data is parsed as numeric
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });


// Calculate Linear Scales

let xLinearScale = d3.scaleLinear()
xLinearScale.range([0,chartWidth]);
let yLinearScale = d3.scaleLinear()
yLinearScale.range([chartHeight,0]);
let chartBottomAxis = d3.axisBottom(xLinearScale);
let chartLeftAxis = d3.axisLeft(yLinearScale);

// Set Chart Axis to poverty and healthcare

let chartXAxis = 'poverty';
let chartYAxis = 'healthcare';

// Calculate the Minimum & Maximum values for the x-axis and y-axis

let xMinimum = d3.min(healthCareData, d => d.healthcare);
let xMaximum = d3.max(healthCareData, d => d.healthcare);
let yMinimum = d3.min(healthCareData, d => d.poverty);
let yMaximum = d3.max(healthCareData, d => d.poverty);
console.log(healthCareData);
console.log(xMinimum, xMaximum, yMinimum, yMaximum)
// Set the linear scale to be the x & y minimum/maximum

xLinearScale.domain([xMinimum, xMaximum]);
yLinearScale.domain([yMinimum, yMaximum]);
console.log()

// Append Axis to the chart
chartGroup.append('g')
    .attr('transform', `translate(0, ${chartHeight}`)
    .call(chartBottomAxis);

chartGroup.append('g')
    .call(chartLeftAxis);

// Create Circles and labels for each state

let chartCircleGroup = chartGroup.selectAll('circle')
    .data(healthCareData)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
        var x = xLinearScale(d.healthcare);
    console.log(d.healthcare);
    return x;
    })

    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", .25);

chartCircleGroup.append("text")
    .style("font-size", "10px")
    .selectAll("tspan")
    .data(healthCareData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.healthcare * 1.5);
        })
        .attr("y", function(data) {
            return yLinearScale(data.poverty * .25)
        })
        .text(function(data) {
            return data.abbr
        });

chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -120)
        .attr("y", 0)
        .text("Lacks Healthcare (%)");

chartGroup.append("text")
        .attr("transform", `translate{${chartWidth}, ${chartHeight} + margin.top})`)
        .text("In Poverty (%)");
     });
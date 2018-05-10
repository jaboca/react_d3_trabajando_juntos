import * as d3 from 'd3';
import { ChartSetup } from './chart.setup';

const style = require("./chart.style.scss");
const styleDefs = require("../../../css/theme/source/fjcalzado-defs.scss");


// Module global variables.
let setup: ChartSetup = null;
let svg = null;
let bars = null;
let x = null;
let y = null;

export const createChart = (chartSetup: ChartSetup, node, data: number[]) => {
  setup = chartSetup;

  // Create SVG.
  svg = d3.select(node)
    .append("svg")
      .attr("width", setup.width)
      .attr("height", setup.height);
  const defs = svg.append("defs")

  // Create effects definitions.
  createGradient(defs);
  createShadow(defs);

  // Create scales;
  const maxDataValue = d3.max(data, (d, i) => d);

  y = d3.scaleLinear()
    .domain([0, maxDataValue])
    .range([setup.height, 0]);
  x = d3.scaleBand<Number>()
    .domain(data.map((d,i) => i))
    .rangeRound([0, setup.width])
    .paddingInner(setup.barSeparation);

  // Create bars. Enter().
  bars = svg
    .append("g")
      .attr("class", style.bar);

  bars.selectAll("rect")
    .data(data)
    .enter().append("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d))
      .attr("height", d => setup.height - y(d))
      .attr("width", d => x.bandwidth())
      .attr("fill", "url(#barGradient)")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);
}

export const updateChart = (data: number[]) => {
  // Rejoin data and update bars with transition.
  bars.selectAll("rect")
    .data(data).transition()
      .duration(setup.transitionDelay)
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d))
      .attr("height", d => setup.height - y(d))
      .attr("width", d => x.bandwidth())
      .attr("fill", "url(#barGradient)");
}

function handleMouseOver(d, i) {
  d3.select(this).transition()
    .attr("fill", styleDefs.selectionColor)
    .attr("stroke", styleDefs.secondaryColor)
    .duration(setup.transitionDelay/4);
}

function handleMouseOut(d, i) {
  d3.select(this).transition()
    .attr("fill", "url(#barGradient)")
    .attr("stroke", undefined)
    .duration(setup.transitionDelay/4);
}

const createGradient = (defs) => {
  const gradient = defs
    .append("linearGradient")
      .attr("id", "barGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0")
      .attr("y1", setup.height)
      .attr("x2", "0")
      .attr("y2", "0");
  gradient
    .append("stop")
      .attr("offset", "0")
      .attr("stop-color", styleDefs.primaryColor);
  gradient
    .append("stop")
      .attr("offset", "30%")
      .attr("stop-color", styleDefs.primaryColor);
  gradient
    .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", styleDefs.secondaryColor);
}

const createShadow = (defs) => {
  // const filter = defs
  //   .append("filter")
  //     .attr("id", "barShadow")
  //     .attr("filterUnits", "userSpaceOnUse")
  //     .attr("x", -50)
  //     .attr("y", -50)
  //     .attr("width", width + 50)
  //     .attr("height", height + 50)
  // filter.append("feGaussianBlur")
  //   .attr("in", "SourceAlpha")
  //   .attr("result", "blurOut")
  //   .attr("stdDeviation", 10);
  // filter.append("feOffset")
  //   .attr("in", "blurOut")
  //   .attr("result", "dropBlur")
  //   .attr("dx", 0)
  //   .attr("dy", 0);
  // filter.append("feComposite")
  //   .attr("operator", "over")
  //   .attr("in", "SourceGraphic")
  //   .attr("in2", "dropBlur")
  //   .attr("result", "final");
}

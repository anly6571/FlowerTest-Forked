import { isArray } from "lodash";
import * as d3 from "d3";
import * as _ from "lodash";
import "./styles.css";
//var _ = require('lodash');

// --- GLOBAL ---
let petalSize = 50;
let petalPath = "M 0,0 C -10, -10 -10, -40 0, -50 C 10, -40 10, -10, 0,0 ";

// --- FUNCTIONS ---
function loadData() {
  const data = d3.csv("data/FakeData.csv", type).then((res) => {
    ready(res);
  });

  // type conversion
  function type(d) {
    return {
      county: d.County,
      energy: +d.PercentRenewable,
      ghg: +d.GHG,
      transit: +d.GreenTransit
    };
  }
}

function ready(data) {
  const numData = data.length + 1;
  const energyMinMax = d3.extent(data, (d) => d.energy);
  const ghgMinMax = d3.extent(data, (d) => d.ghg);
  const sizeScale = d3.scaleLinear().domain(energyMinMax).range([0.25, 1]); //size mapped to energy
  const numPetalScale = d3.scaleQuantize().domain(ghgMinMax).range([5, 7, 12]); //number mapped to ghg
  const xScale = d3.scaleLinear().domain([0, numData]).range([0, 1000]);

  //for each county, return data
  const flowersData = _.map(data, (d) => {
    const numPetals = numPetalScale(d.ghg);
    // console.log(numPetals);
    const petSize = sizeScale(d.energy);
    return {
      petSize,
      petals: _.times(numPetals, (i) => {
        return { angle: (360 * i) / numPetals, petalPath };
      }),
      numPetals
    };
  });
  //console.log(`Petals: ${numPetals}, size: ${size}`);
  //console.log(flowersData[0].petSize);
  console.log(flowersData);

  //base SVG
  const svg = d3
    .select(".vis")
    .append("svg")
    .attr("width", petalSize * 20)
    .attr("height", petalSize * 20)
    .append("g");

  const flowers = d3
    .select("svg")
    .selectAll("g")
    .data(flowersData)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d, i) =>
        `translate(${
          petalSize + (i - 1) * (2 * petalSize)
        },${petalSize} )scale(${d.petSize})`
    );

  // .attr(
  //   "transform",
  //   (d, i) =>
  //     `translate(${(i % 5) * petalSize},${
  //       Math.floor(i / 5) * petalSize
  //     })scale(${d.petSize})`
  // )
  // .attr("transform", "translate(50, 50)");

  flowers
    .selectAll("path")
    .data((d) => d.petals) //array of petals from above
    .enter()
    .append("path")
    .attr("d", (d) => d.petalPath) //
    .attr("x", (d) => xScale(d.numPetals))
    .attr("transform", (d) => `rotate(${d.angle})`) //rotates each petal
    .attr("fill", (d, i) => d3.interpolateBlues(d.angle / 360));
  return svg;
}
loadData();

//Loads data, console logs it as an array of objects
//const svg = DOM.svg(petalSize * 2, petalSize * 2);
//create one flower

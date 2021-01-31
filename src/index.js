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
  const energyMinMax = d3.extent(data, (d) => d.energy);
  const ghgMinMax = d3.extent(data, (d) => d.ghg);
  const sizeScale = d3.scaleLinear().domain(energyMinMax).range([0.25, 1]); //size mapped to energy
  const numPetalScale = d3.scaleQuantize().domain(ghgMinMax).range([5, 7, 10]); //number mapped to ghg

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

  const svg = d3
    .select(".vis")
    .append("svg")
    .attr("width", petalSize * 2)
    .attr("height", petalSize * 2)
    .append("g");
  //.attr("transform", "translate(50,50)");

  const flowers = d3
    .select("svg")
    .selectAll("g")
    .data(flowersData)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d, i) =>
        `translate(${(i % 5) * petalSize},${
          Math.floor(i / 5) * petalSize
        })scale(${d.petSize})`
    )
    .attr("transform", "translate(50, 50)");

  flowers
    .selectAll("path")
    .data((d) => d.petals)
    .enter()
    .append("path")
    .attr("d", (d) => d.petalPath)
    .attr("transform", (d) => `rotate(${d.angle})`);
  //.attr('fill', (d, i) => d3.interpolateWarm(d.angle / 360));
  return svg;
}
//   const flowers = svg
//     //.select('svg')
//     .selectAll('g')
//     .data(flowersData)
//     .enter()
//     .append('g')
//     .attr(
//       "transform",
//       (d) => `translate(${petalSize})scale(${d.petSize})`);
//      //changes size of the flower/group

// console.log(petalPath);
//   flowers
//     .selectAll("path") //for each flower select all of the paths
//     .data(d => d.petals)
//     .enter()
//     .append('path') //returns array of petals from above
//     .attr('d', d => d.petalPath)
//     .attr("tranform", (d) => `rotate(${d.angle})`)
//     .style("fill", "blue");

//   return svg;
// }

loadData();

//Loads data, console logs it as an array of objects
//const svg = DOM.svg(petalSize * 2, petalSize * 2);
//create one flower
